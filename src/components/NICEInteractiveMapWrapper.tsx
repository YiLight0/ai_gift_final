import NICEInteractiveMap from './NICEInteractiveMap';
import { NICERole, NICEPartner } from '../data/mockData';

interface NICEInteractiveMapWrapperProps {
  partners: NICEPartner[];
  selectedPartner: NICEPartner | null;
  onPartnerSelect: (partner: NICEPartner) => void;
  selectedRole: NICERole | 'all';
  selectedCapability: string;
}

export default function NICEInteractiveMapWrapper(props: NICEInteractiveMapWrapperProps) {
  return <NICEInteractiveMap {...props} />;
}
