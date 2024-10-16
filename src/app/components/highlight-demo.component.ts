// highlight-demo.component.ts
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HighlightOptions, HighlightPipe } from '../Pipes/highlight.pipe';

@Component({
  selector: 'app-highlight-demo',
  standalone: true,
  imports: [ReactiveFormsModule, HighlightPipe],
  template: `
    <div class="highlight-demo">
      <form [formGroup]="form" class="controls">
        <div class="search-field">
          <label for="search">Termo de busca:</label>
          <input
            id="search"
            type="text"
            formControlName="searchText"
            placeholder="Digite o termo de busca..."
          />
        </div>

        <div class="options">
          <div class="option">
            <label>
              <input type="checkbox" formControlName="caseSensitive" />
              Case Sensitive
            </label>
          </div>

          <div class="option">
            <label>
              <input type="checkbox" formControlName="wholeWord" />
              Palavras Inteiras
            </label>
          </div>

          <div class="option">
            <label>
              <input type="checkbox" formControlName="normalizeAccents" />
              Ignorar Acentos
            </label>
          </div>

          <div class="option">
            <label>
              <input type="checkbox" formControlName="matchPartialWords" />
              Match Parcial
            </label>
          </div>

          <div class="option">
            <label>Tag HTML:</label>
            <select formControlName="customTag">
              <option value="strong">strong</option>
              <option value="mark">mark</option>
              <option value="em">em</option>
              <option value="span">span</option>
            </select>
          </div>

          <div class="option">
            <label>Classe CSS:</label>
            <select formControlName="cssClass">
              <option value="highlighted-text">highlighted-text</option>
              <option value="yellow-highlight">yellow-highlight</option>
              <option value="blue-highlight">blue-highlight</option>
              <option value="underline-highlight">underline-highlight</option>
            </select>
          </div>
        </div>
      </form>

      <div class="preview">
        <h4>Texto Original:</h4>
        <p>{{ text }}</p>

        <h4>Texto com Highlight:</h4>
        <p
          [innerHTML]="
            text | highlight : form.value.searchText : highlightOptions
          "
        ></p>
      </div>
    </div>
  `,
  styles: [
    `
      .highlight-demo {
        padding: 20px;
        max-width: 800px;
      }

      .controls {
        margin-bottom: 20px;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }

      .search-field {
        margin-bottom: 15px;
      }

      .search-field input {
        width: 100%;
        padding: 8px;
        margin-top: 5px;
      }

      .options {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 10px;
      }

      .option {
        margin: 5px 0;
      }

      .preview {
        margin-top: 20px;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }

      h4 {
        margin: 0 0 10px;
        color: #666;
      }

      /* Highlight Styles */
      :host ::ng-deep .highlighted-text {
        background-color: yellow;
        font-weight: bold;
      }

      :host ::ng-deep .yellow-highlight {
        background-color: #fff59d;
        padding: 0 2px;
        border-radius: 2px;
      }

      :host ::ng-deep .blue-highlight {
        background-color: #90caf9;
        padding: 0 2px;
        border-radius: 2px;
      }

      :host ::ng-deep .underline-highlight {
        border-bottom: 2px solid #f44336;
        padding-bottom: 2px;
      }
    `,
  ],
})
export class HighlightDemoComponent {
  @Input() text: string =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. São Paulo é uma cidade grande!';

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      searchText: [''],
      caseSensitive: [false],
      wholeWord: [false],
      normalizeAccents: [true],
      matchPartialWords: [true],
      customTag: ['strong'],
      cssClass: ['highlighted-text'],
    });
  }

  get highlightOptions(): HighlightOptions {
    const { searchText, ...options } = this.form.value;
    return options;
  }
}
