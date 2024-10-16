import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export interface HighlightOptions {
  cssClass?: string;
  caseSensitive?: boolean;
  wholeWord?: boolean;
  normalizeAccents?: boolean;
  customTag?: string;
  matchPartialWords?: boolean;
}

const DEFAULT_OPTIONS: HighlightOptions = {
  cssClass: 'highlighted-text',
  caseSensitive: false,
  wholeWord: false,
  normalizeAccents: true,
  customTag: 'strong',
  matchPartialWords: true,
} as const;

@Pipe({
  name: 'highlight',
  standalone: true,
  pure: true,
})
export class HighlightPipe implements PipeTransform {
  private static readonly SPECIAL_CHARS_REGEX = /[.*+?^${}()|[\]\\]/g;
  private readonly sanitizer = inject(DomSanitizer);

  private regexCache = new Map<string, RegExp>();

  transform(
    text: string | null | undefined,
    searchText: string | null | undefined,
    options: Partial<HighlightOptions> = {}
  ): SafeHtml {
    if (!text || !searchText) {
      return text || '';
    }

    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

    try {
      const normalizedText = this.normalizeText(text, mergedOptions);
      const normalizedSearchText = this.normalizeText(
        searchText,
        mergedOptions
      );
      const words = this.getSearchWords(normalizedSearchText);

      if (!words.length) return text;

      const regex = this.getRegexForSearch(words, mergedOptions);
      const highlighted = this.applyHighlight(
        text,
        normalizedText,
        regex,
        mergedOptions
      );

      return this.sanitizer.bypassSecurityTrustHtml(highlighted);
    } catch (error) {
      console.warn('Error in highlight pipe:', error);
      return text;
    }
  }

  private normalizeText(text: string, options: HighlightOptions): string {
    let normalized = options.caseSensitive ? text : text.toLowerCase();

    if (options.normalizeAccents) {
      normalized = normalized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    return normalized;
  }

  private getSearchWords(searchText: string): string[] {
    return searchText
      .split(/\s+/)
      .filter((word) => word.length > 0)
      .map((word) => this.escapeRegExp(word.trim()));
  }

  private getRegexForSearch(
    words: string[],
    options: HighlightOptions
  ): RegExp {
    const cacheKey = this.createCacheKey(words, options);

    if (this.regexCache.has(cacheKey)) {
      return this.regexCache.get(cacheKey)!;
    }

    // Criar padrão que corresponda a palavras parciais ou completas
    const pattern = words
      .map((word) => {
        if (options.matchPartialWords) {
          return word;
        }
        return `\\b${word}\\b`;
      })
      .join('|');

    const flags = options.caseSensitive ? 'g' : 'gi';
    const regex = new RegExp(`(${pattern})`, flags);

    this.regexCache.set(cacheKey, regex);
    return regex;
  }

  private createCacheKey(words: string[], options: HighlightOptions): string {
    return `${words.join('|')}:${JSON.stringify(options)}`;
  }

  private applyHighlight(
    originalText: string,
    normalizedText: string,
    regex: RegExp,
    options: HighlightOptions
  ): string {
    const { cssClass, customTag } = options;
    const tag = customTag?.toLowerCase() || 'strong';
    const matches: Array<{ index: number; length: number }> = [];

    let match;
    while ((match = regex.exec(normalizedText)) !== null) {
      matches.push({
        index: match.index,
        length: match[0].length,
      });
    }

    // Aplicar highlights do fim para o início para não afetar os índices
    let result = originalText;
    for (let i = matches.length - 1; i >= 0; i--) {
      const { index, length } = matches[i];
      const originalSubstring = originalText.substr(index, length);
      const replacement = cssClass
        ? `<${tag} class="${cssClass}">${originalSubstring}</${tag}>`
        : `<${tag}>${originalSubstring}</${tag}>`;

      result =
        result.substring(0, index) +
        replacement +
        result.substring(index + length);
    }

    return result;
  }

  private escapeRegExp(text: string): string {
    return text.replace(HighlightPipe.SPECIAL_CHARS_REGEX, '\\$&');
  }
}
