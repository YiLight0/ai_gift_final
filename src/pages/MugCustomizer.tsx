import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Download,
  Image as ImageIcon,
  MessageCircle,
  Palette,
  RefreshCw,
  Send,
  Sparkles,
  TestTube,
} from 'lucide-react';

type Role = 'user' | 'agent';

interface Message {
  role: Role;
  content: string;
}

interface PrintArea {
  key?: string;
  label: string;
  widthMm: number;
  heightMm: number;
}

interface StyleOption {
  id?: string;
  filename: string;
  url: string;
}

interface CatalogCategory {
  id: string;
  name: string;
  mode: 'single' | 'split';
  image_size: string;
  print_areas: PrintArea[];
  styles: StyleOption[];
}

interface DesignPart {
  key: string;
  imageUrl?: string | null;
  imageBase64?: string | null;
}

interface ResultSnapshot {
  designPreviewUrl: string;
  designParts: DesignPart[];
  mockupImageUrl: string;
  categoryName: string;
  styleFilename: string;
  categoryLabel: string;
  styleLabel: string;
  isSplitMode: boolean;
}

const INITIAL_AGENT_MESSAGE =
  '可以先告诉我想送给谁、偏好的风格、颜色和氛围，我会先和你一起整理想法。';

function buildConversationText(messages: Message[]) {
  return messages
    .map((message) => `${message.role === 'user' ? '用户' : '助手'}：${message.content}`)
    .join('\n');
}

function getDesignPartSrc(part?: DesignPart) {
  if (!part) return '';
  if (part.imageUrl) return part.imageUrl;
  if (part.imageBase64) return `data:image/png;base64,${part.imageBase64}`;
  return '';
}

function buildAgentReply(text: string, categoryName: string) {
  const normalized = text.trim();
  const categoryHint = categoryName ? `当前会按“${categoryName}”这类杯型来考虑排版。` : '';

  if (!normalized) {
    return '可以继续补充想法，比如送礼对象、风格关键词、主色调或者希望呈现的情绪。';
  }

  if (normalized.length < 8) {
    return `我先记下这个方向。${categoryHint} 你也可以再补充一点画面元素、颜色或者想要的感觉。`;
  }

  return `收到，我会先把这段需求记住。${categoryHint} 你还可以继续补充图案元素、文字内容或是否偏节日礼物感。`;
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: '请求失败' }));
    throw new Error(error.error || '请求失败');
  }
  return response.json();
}

async function postJson<T>(url: string, payload: unknown): Promise<T> {
  return fetchJson<T>(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export default function MugCustomizer() {
  const [catalog, setCatalog] = useState<CatalogCategory[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [styleFilename, setStyleFilename] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'agent', content: INITIAL_AGENT_MESSAGE },
  ]);
  const [userInput, setUserInput] = useState('');
  const [summary, setSummary] = useState('');
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [designPreviewUrl, setDesignPreviewUrl] = useState('');
  const [designParts, setDesignParts] = useState<DesignPart[]>([]);
  const [mockupImageUrl, setMockupImageUrl] = useState('');
  const [resultSnapshot, setResultSnapshot] = useState<ResultSnapshot | null>(null);
  const [isCatalogLoading, setIsCatalogLoading] = useState(true);
  const [isPrompting, setIsPrompting] = useState(false);
  const [isGeneratingDesign, setIsGeneratingDesign] = useState(false);
  const [isRenderingMockup, setIsRenderingMockup] = useState(false);
  const [error, setError] = useState('');

  const currentCategory = useMemo(
    () => catalog.find((item) => item.id === categoryName) || catalog[0],
    [catalog, categoryName],
  );

  const currentStyle = useMemo(
    () =>
      currentCategory?.styles.find((item) => item.filename === styleFilename) ||
      currentCategory?.styles[0],
    [currentCategory, styleFilename],
  );

  useEffect(() => {
    async function loadCatalog() {
      setIsCatalogLoading(true);
      setError('');

      try {
        const data = await fetchJson<{ categories: CatalogCategory[] }>('/api/catalog');
        const nextCatalog = data.categories || [];
        setCatalog(nextCatalog);
        setCategoryName((current) =>
          nextCatalog.find((item) => item.id === current) ? current : nextCatalog[0]?.id || '',
        );
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : '读取品类失败');
      } finally {
        setIsCatalogLoading(false);
      }
    }

    loadCatalog();
  }, []);

  useEffect(() => {
    if (!currentCategory) return;

    const hasStyle = currentCategory.styles.some((item) => item.filename === styleFilename);
    if (!hasStyle) {
      setStyleFilename(currentCategory.styles[0]?.filename || '');
    }
  }, [currentCategory, styleFilename]);

  const resetCurrentWorkflowState = () => {
    setSummary('');
    setPrompt('');
    setNegativePrompt('');
    setDesignPreviewUrl('');
    setDesignParts([]);
    setMockupImageUrl('');
  };

  const buildSnapshot = (
    nextDesignPreviewUrl: string,
    nextDesignParts: DesignPart[],
    nextMockupImageUrl: string,
  ): ResultSnapshot => ({
    designPreviewUrl: nextDesignPreviewUrl,
    designParts: nextDesignParts,
    mockupImageUrl: nextMockupImageUrl,
    categoryName,
    styleFilename,
    categoryLabel: currentCategory?.name || '未选择品类',
    styleLabel: currentStyle?.filename || '未选择款式图',
    isSplitMode: currentCategory?.mode === 'split',
  });

  const handleCategoryChange = (nextCategory: CatalogCategory) => {
    setCategoryName(nextCategory.id);
    setStyleFilename(nextCategory.styles[0]?.filename || '');
    resetCurrentWorkflowState();
    setError('');
  };

  const handleStyleChange = (nextStyleFilename: string) => {
    setStyleFilename(nextStyleFilename);
    setMockupImageUrl('');
    setError('');
  };

  const handleSendMessage = () => {
    const text = userInput.trim();
    if (!text) return;

    const reply = buildAgentReply(text, currentCategory?.name || categoryName);
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: text },
      { role: 'agent', content: reply },
    ]);
    setUserInput('');
    setError('');
  };

  const resolveConversationBeforePrompt = () => {
    const text = userInput.trim();
    if (!messages.length && !text) {
      throw new Error('请先输入设计需求。');
    }

    if (!text) {
      return messages;
    }

    const reply = buildAgentReply(text, currentCategory?.name || categoryName);
    const nextMessages = [
      ...messages,
      { role: 'user' as const, content: text },
      { role: 'agent' as const, content: reply },
    ];
    setMessages(nextMessages);
    setUserInput('');
    return nextMessages;
  };

  const handleGeneratePrompt = async () => {
    setIsPrompting(true);
    setError('');

    try {
      const conversationMessages = resolveConversationBeforePrompt();
      const result = await postJson<{
        reply: string;
        prompt: string;
        negative_prompt: string;
      }>('/api/prompt', {
        user_text: buildConversationText(conversationMessages),
        category_name: categoryName,
      });

      setSummary(result.reply);
      setPrompt(result.prompt);
      setNegativePrompt(result.negative_prompt);
      return result;
    } catch (promptError) {
      setError(promptError instanceof Error ? promptError.message : '整理需求失败');
      return null;
    } finally {
      setIsPrompting(false);
    }
  };

  const handleGenerateDesign = async () => {
    setIsGeneratingDesign(true);
    setError('');

    try {
      const promptResult =
        prompt && negativePrompt
          ? { prompt, negative_prompt: negativePrompt, reply: summary }
          : await handleGeneratePrompt();

      if (!promptResult?.prompt) {
        return;
      }

      const result = await postJson<{
        image_url: string;
        mode: string;
        design_parts: DesignPart[];
      }>('/api/generate-design', {
        category_name: categoryName,
        prompt: promptResult.prompt,
        negative_prompt: promptResult.negative_prompt,
      });

      setDesignPreviewUrl(result.image_url);
      setDesignParts(result.design_parts || []);
      setMockupImageUrl('');
      setResultSnapshot(buildSnapshot(result.image_url, result.design_parts || [], ''));
    } catch (designError) {
      setError(designError instanceof Error ? designError.message : '生成图案失败');
    } finally {
      setIsGeneratingDesign(false);
    }
  };

  const handleRenderMockup = async () => {
    if (!designParts.length) {
      setError('请先生成图案。');
      return;
    }

    setIsRenderingMockup(true);
    setError('');

    try {
      const result = await postJson<{
        mockup_image_url: string;
      }>('/api/render-mockup', {
        category_name: categoryName,
        style_filename: styleFilename,
        design_parts: designParts,
      });

      setMockupImageUrl(result.mockup_image_url);
      setResultSnapshot(buildSnapshot(designPreviewUrl, designParts, result.mockup_image_url));
    } catch (mockupError) {
      setError(mockupError instanceof Error ? mockupError.message : '渲染效果图失败');
    } finally {
      setIsRenderingMockup(false);
    }
  };

  const handleRegenerate = async () => {
    setDesignPreviewUrl('');
    setDesignParts([]);
    setMockupImageUrl('');
    await handleGenerateDesign();
  };

  const handleDownload = (url: string, filename: string) => {
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  };

  const designStatus = isGeneratingDesign ? '生成中' : designPreviewUrl ? '已生成' : '待生成';
  const mockupStatus = isRenderingMockup ? '渲染中' : mockupImageUrl ? '已完成' : '待渲染';
  const displaySnapshot = resultSnapshot;
  const isSplitMode = currentCategory?.mode === 'split';
  const topPart = displaySnapshot?.designParts.find((item) => item.key === 'top');
  const bottomPart = displaySnapshot?.designParts.find((item) => item.key === 'bottom');

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-orange-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="mb-8 overflow-hidden rounded-[32px] border border-white/70 bg-white/70 shadow-[0_24px_80px_rgba(246,97,97,0.12)] backdrop-blur-xl">
          <div className="grid gap-8 px-6 py-7 lg:grid-cols-[1.2fr,0.8fr] lg:px-8">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-600">
                <Sparkles className="h-4 w-4" />
                真实工作流已接入
              </div>
              <h1 className="max-w-3xl text-3xl font-bold text-gray-900 md:text-5xl">
                AI杯子定制平台
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600 md:text-lg">
                已经接入了三种杯型的真实工作流。你只需要描述想法，选择款式图，就可以预览效果图、定制产品。
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  {
                    title: '整理需求',
                    desc: '基于完整对话整理设计方向，方便你确认想法是否准确。',
                    icon: MessageCircle,
                  },
                  {
                    title: '生成图案',
                    desc: '自动适配单区域与双区域输出，保留后续渲染所需结构。',
                    icon: Palette,
                  },
                  {
                    title: '渲染效果图',
                    desc: '结合真实款式图完成杯身预览，直接看到最终展示效果。',
                    icon: TestTube,
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-3xl border border-red-100/80 bg-white/80 p-4 shadow-sm"
                  >
                    <item.icon className="mb-3 h-5 w-5 text-red-500" />
                    <h2 className="text-sm font-semibold text-gray-900">{item.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-gray-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] bg-gradient-to-br from-red-500 via-rose-500 to-orange-400 p-[1px] shadow-xl">
              <div className="h-full rounded-[27px] bg-white/95 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">当前品类</p>
                    <h2 className="mt-1 text-2xl font-bold text-gray-900">
                      {currentCategory?.name || '加载中...'}
                    </h2>
                  </div>
                  <div className="rounded-2xl bg-red-50 px-4 py-3 text-right">
                    <p className="text-xs uppercase tracking-[0.18em] text-red-500">Mode</p>
                    <p className="mt-1 text-sm font-semibold text-red-600">
                      {isSplitMode ? '双区域渲染' : '单区域渲染'}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {currentCategory?.print_areas.map((area) => (
                    <div
                      key={`${area.label}-${area.widthMm}-${area.heightMm}`}
                      className="flex items-center justify-between rounded-2xl border border-red-100 bg-red-50/60 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">{area.label}</p>
                        <p className="text-xs text-gray-500">适配当前杯型的印刷区域</p>
                      </div>
                      <p className="text-sm font-semibold text-red-600">
                        {area.widthMm} × {area.heightMm} mm
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-dashed border-red-200 bg-gradient-to-r from-red-50 to-orange-50 px-4 py-4 text-sm leading-6 text-gray-600">
                  先描述你的想法，再点击“整理需求”生成设计摘要。切换品类时只会重置当前编辑流程，不会清空结果展示区里上一次已生成的内容。
                </div>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 shadow-sm">
            {error}
          </div>
        )}

        <section className="grid gap-6 xl:grid-cols-[0.94fr,1.06fr]">
          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/80 bg-white/80 p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-500">第一步</p>
                  <h2 className="mt-1 text-xl font-semibold text-gray-900">需求对话区</h2>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  发送后会继续完善你的需求
                </div>
              </div>

              <div className="mb-4 h-[280px] overflow-y-auto rounded-3xl bg-gradient-to-br from-red-50 via-white to-orange-50 p-4">
                <div className="space-y-3">
                  {messages.map((message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                        message.role === 'user'
                          ? 'ml-auto rounded-br-md bg-red-100 text-gray-800'
                          : 'rounded-bl-md bg-white text-gray-600'
                      }`}
                    >
                      {message.content}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <textarea
                  value={userInput}
                  onChange={(event) => setUserInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="描述你想要的图案主题、氛围、颜色、赠送对象和风格偏好..."
                  className="min-h-[120px] flex-1 rounded-3xl border border-red-100 bg-white px-4 py-4 text-sm text-gray-700 outline-none transition focus:border-red-300 focus:ring-4 focus:ring-red-100"
                />
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!userInput.trim()}
                  className="self-end rounded-2xl bg-gray-900 px-5 py-4 text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="发送需求"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/80 bg-white/80 p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl">
              <div className="mb-5">
                <p className="text-sm text-red-500">第二步</p>
                <h2 className="mt-1 text-xl font-semibold text-gray-900">品类与款式</h2>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-500">选择品类</h3>
                <div className="flex flex-wrap gap-3">
                  {catalog.map((item) => {
                    const active = item.id === categoryName;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleCategoryChange(item)}
                        className={`rounded-full px-5 py-3 text-sm font-medium transition ${
                          active
                            ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-200'
                            : 'bg-red-50 text-gray-700 hover:bg-red-100'
                        }`}
                      >
                        {item.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-500">选择款式图</h3>
                  <p className="text-xs text-gray-400">
                    {isCatalogLoading
                      ? '正在读取素材...'
                      : `${currentCategory?.styles.length || 0} 个可用款式`}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {currentCategory?.styles.map((style) => {
                    const active = style.filename === currentStyle?.filename;
                    return (
                      <button
                        key={style.filename}
                        onClick={() => handleStyleChange(style.filename)}
                        className={`overflow-hidden rounded-3xl border bg-white text-left transition ${
                          active
                            ? 'border-red-400 shadow-[0_16px_30px_rgba(244,63,94,0.18)]'
                            : 'border-red-100 hover:border-red-200 hover:shadow-md'
                        }`}
                      >
                        <div className="flex aspect-square items-center justify-center overflow-hidden bg-white p-3">
                          <img
                            src={style.url}
                            alt={style.filename}
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <div className="flex items-center justify-between border-t border-red-50 px-4 py-3">
                          <span className="truncate text-sm font-medium text-gray-700">
                            {style.filename}
                          </span>
                          {active && <CheckCircle2 className="h-4 w-4 text-red-500" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/80 bg-white/80 p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-500">第三步</p>
                  <h2 className="mt-1 text-xl font-semibold text-gray-900">总结与生成</h2>
                </div>
                <div className="rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-500">
                  当前款式：{currentStyle?.filename || '未选择'}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <button
                  onClick={handleGeneratePrompt}
                  disabled={isPrompting}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-400 to-amber-400 px-4 py-4 font-medium text-white shadow-lg shadow-orange-100 transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Sparkles className={`h-4 w-4 ${isPrompting ? 'animate-spin' : ''}`} />
                  {isPrompting ? '整理中...' : '整理需求'}
                </button>
                <button
                  onClick={handleGenerateDesign}
                  disabled={isGeneratingDesign}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 px-4 py-4 font-medium text-white shadow-lg shadow-red-100 transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Sparkles className={`h-4 w-4 ${isGeneratingDesign ? 'animate-spin' : ''}`} />
                  {isGeneratingDesign ? '生成中...' : '生成图案'}
                </button>
                <button
                  onClick={handleRenderMockup}
                  disabled={isRenderingMockup || !designParts.length}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-700 px-4 py-4 font-medium text-white shadow-lg shadow-gray-200 transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <TestTube className={`h-4 w-4 ${isRenderingMockup ? 'animate-spin' : ''}`} />
                  {isRenderingMockup ? '渲染中...' : '渲染效果图'}
                </button>
                <button
                  onClick={handleRegenerate}
                  disabled={isGeneratingDesign}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-red-100 bg-white px-4 py-4 font-medium text-gray-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <RefreshCw className="h-4 w-4" />
                  重新生成
                </button>
              </div>

              <div className="mt-6 rounded-3xl border border-red-100 bg-gradient-to-br from-red-50 via-white to-orange-50 p-5">
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-red-600 shadow-sm">
                    图案状态：{designStatus}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-sm">
                    效果图状态：{mockupStatus}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-sm">
                    {isSplitMode ? '双区域工作流' : '单区域工作流'}
                  </span>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1.05fr,0.95fr]">
                  <div className="rounded-3xl border border-white bg-white/90 p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                        <Palette className="h-4 w-4 text-red-500" />
                        需求总结
                      </div>
                      <span className="text-xs text-gray-400">基于整段对话生成</span>
                    </div>

                    <div className="rounded-2xl bg-gray-900 px-4 py-4 text-sm leading-6 text-gray-100">
                      {summary ? (
                        <p className="whitespace-pre-wrap">{summary}</p>
                      ) : (
                        <p className="text-gray-400">
                          点击“整理需求”后，这里会显示整理后的设计摘要，方便你确认方向是否准确。
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white bg-white/90 p-4 shadow-sm">
                    <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-800">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      使用说明
                    </div>
                    <div className="space-y-3 text-sm leading-6 text-gray-600">
                      <p>1. 先描述你的想法，再点击“整理需求”确认设计方向。</p>
                      <p>2. 结果展示区会保留最近一次生成结果，方便你切换品类后继续对比。</p>
                      <p>3. 部分杯型会自动拆分设计区域，以获得更准确的效果图展示。</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/80 bg-white/80 p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-500">最新结果</p>
                  <h2 className="mt-1 text-xl font-semibold text-gray-900">结果展示</h2>
                </div>
                <div className="text-right text-xs text-gray-400">
                  <p>{displaySnapshot?.categoryLabel || '暂无已生成结果'}</p>
                  <p>{displaySnapshot?.styleLabel || '等待第一次生成'}</p>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <article className="rounded-3xl border border-red-100 bg-gradient-to-br from-red-50 via-white to-orange-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                      <ImageIcon className="h-4 w-4 text-red-500" />
                      图案预览
                    </div>
                    <span className="text-xs text-gray-500">
                      {displaySnapshot?.designPreviewUrl ? '已生成' : '待生成'}
                    </span>
                  </div>

                  <div className="rounded-[26px] border border-white bg-white/90 p-4 shadow-inner">
                    {displaySnapshot?.designPreviewUrl ? (
                      <div className="flex justify-center">
                        <img
                          src={displaySnapshot.designPreviewUrl}
                          alt="图案预览"
                          className="h-auto max-w-full rounded-2xl"
                        />
                      </div>
                    ) : (
                      <div className="flex min-h-[280px] items-center justify-center text-center text-gray-400">
                        <div>
                          <ImageIcon className="mx-auto h-12 w-12 opacity-50" />
                          <p className="mt-3 text-sm">生成后的图案会显示在这里</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {displaySnapshot?.isSplitMode && (topPart || bottomPart) && (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {[
                        { label: '上方条带', part: topPart },
                        { label: '下方主图', part: bottomPart },
                      ].map(({ label, part }) => (
                        <div key={label} className="rounded-2xl border border-red-100 bg-white p-3">
                          <p className="mb-2 text-xs font-medium text-gray-500">{label}</p>
                          <div className="flex min-h-28 items-center justify-center rounded-2xl bg-red-50 p-2">
                            {getDesignPartSrc(part) ? (
                              <img
                                src={getDesignPartSrc(part)}
                                alt={label}
                                className="h-auto max-w-full object-contain"
                              />
                            ) : (
                              <span className="text-xs text-gray-400">等待生成</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() =>
                      handleDownload(displaySnapshot?.designPreviewUrl || '', 'mug-design.png')
                    }
                    disabled={!displaySnapshot?.designPreviewUrl}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Download className="h-4 w-4" />
                    下载图案
                  </button>
                </article>

                <article className="rounded-3xl border border-red-100 bg-gradient-to-br from-red-50 via-white to-orange-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                      <TestTube className="h-4 w-4 text-red-500" />
                      杯身效果图
                    </div>
                    <span className="text-xs text-gray-500">
                      {displaySnapshot?.mockupImageUrl ? '已完成' : '待渲染'}
                    </span>
                  </div>

                  <div className="rounded-[26px] border border-white bg-white/90 p-4 shadow-inner">
                    {displaySnapshot?.mockupImageUrl ? (
                      <div className="flex justify-center">
                        <img
                          src={displaySnapshot.mockupImageUrl}
                          alt="效果图预览"
                          className="h-auto max-w-full rounded-2xl"
                        />
                      </div>
                    ) : (
                      <div className="flex min-h-[280px] items-center justify-center text-center text-gray-400">
                        <div>
                          <TestTube className="mx-auto h-12 w-12 opacity-50" />
                          <p className="mt-3 text-sm">渲染后的杯身效果图会显示在这里</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      handleDownload(displaySnapshot?.mockupImageUrl || '', 'mug-mockup.png')
                    }
                    disabled={!displaySnapshot?.mockupImageUrl}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Download className="h-4 w-4" />
                    下载效果图
                  </button>
                </article>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
