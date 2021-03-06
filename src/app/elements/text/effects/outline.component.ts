import { Component, Input } from '@angular/core';
import { Color } from '../../../colors/color';
import { ColorsService } from '../../../colors/colors.service';
import { EffectComponent} from '../../effect.component';
import { Outline } from './outline';
import { TextElement } from '../text-element';
import { TextElementComponent } from '../text-element.component';

@Component({
  selector: 'app-outline',
  styles: [`
    :host {
      width: 100%;
      margin-bottom: 1em;
    }

    .effect-controls {
      margin-left: 0;
      margin-right: 0;
    }
  `],
  templateUrl: 'outline.component.html',
})
export class OutlineComponent extends EffectComponent {
  @Input() element: TextElement;
  public outlineLabel = 'Outline #1';
  public effect: Outline;
  elementComponent: TextElementComponent;
  private availableColors: Color[];

  constructor(elementComponent: TextElementComponent, private colorsService: ColorsService) {
    super(elementComponent);
  }

  protected additionalOnInit() {
    this.colorsService.getColors().subscribe(colors => {
      this.availableColors = colors;
      if (!this.effect.color) {
        // pick first available color which isn't already being used
        const usedColors = this.element.colors();
        const color = this.availableColors.find((c) => {
          if (!usedColors.find((uc) => uc.id === c.id)) {
            return true;
          }
        });
        this.onSelectColor(color);
      }
    });
  }

  onEffectChanges(property: string, value: any) {
    if (property === 'enabled') {
      this.effect.enabled = value;
      if (value === false) {
        this.effect.removeEffect();
      }
    }
    super.onEffectChanges(property, value);
  }

  onSelectColor(color: Color) {
    if (color.id === 'GARMENT_COLOR') {
      color.rgb = this.elementComponent.getCurrentDesign().productColor.swatch();
    }
    this.onEffectChanges('color', color);
  }

  protected newEffect(): Outline {
    return new Outline();
  }

  protected effectClass(): string {
    return 'Outline';
  }
}
