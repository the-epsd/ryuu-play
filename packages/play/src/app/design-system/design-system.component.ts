import { Component } from '@angular/core';

@Component({
  selector: 'app-design-system',
  templateUrl: './design-system.component.html',
  styleUrls: ['./design-system.component.scss']
})
export class DesignSystemComponent {
  sections = [
    { name: 'Colors', id: 'colors' },
    { name: 'Typography', id: 'typography' },
    { name: 'Components', id: 'components' },
    { name: 'Spacing', id: 'spacing' },
    { name: 'Icons', id: 'icons' }
  ];

  colors = [
    { name: 'Background Dark', hex: '#111317', usage: 'Main background color' },
    { name: 'Background Light', hex: '#23272F', usage: 'Secondary background, cards' },
    { name: 'Surface', hex: '#333A47', usage: 'Surface elements, elevated components' },
    { name: 'Border', hex: '#454E5F', usage: 'Borders, dividers' },
    { name: 'Muted', hex: '#5E6B82', usage: 'Muted text, secondary elements' },
    { name: 'Text', hex: '#F3F4F6', usage: 'Primary text color' },
    { name: 'Twinleaf Green', hex: '#459058', usage: 'Brand color, accents, CTAs' }
  ];
} 