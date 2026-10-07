const fs = require('fs');

const targetFile = 'C:\\Users\\Ali\\Desktop\\LamsaProject\\Lamsa-FrontEnd\\src\\app\\core\\services\\sanity.service.ts';

const content = `import { Injectable } from '@angular/core';
import {
  createClient,
  type ClientReturn,
  type QueryParams,
  type SanityClient,
} from '@sanity/client';
import imageUrlBuilder, {
  type ImageUrlBuilder,
} from '@sanity/image-url';
import { environment } from '../../../environments/environment';

export type SanityImageSource = any;

@Injectable({ providedIn: 'root' })
export class SanityService {
  private client: SanityClient;
  private builder: ImageUrlBuilder;

  constructor() {
    this.client = createClient({
      projectId: environment.sanity.projectId,
      dataset: environment.sanity.dataset,
      apiVersion: environment.sanity.apiVersion,
      useCdn: true,
    });
    this.builder = imageUrlBuilder(this.client);
  }

  /**
   * Fetch documents using GROQ. Works with Sanity TypeGen when queries
   * are wrapped in \`defineQuery\` from the \`groq\` package.
   */
  fetch<Query extends string>(
    query: Query,
    params?: QueryParams
  ): Promise<ClientReturn<Query>> {
    return this.client.fetch(query, params);
  }

  /** Build an optimised image URL from a Sanity image reference. */
  getImageUrlBuilder(source: SanityImageSource): ImageUrlBuilder {
    return this.builder.image(source);
  }

  /** Convenience: build a URL string at a given width with WebP/AVIF. */
  imageUrl(source: SanityImageSource, width?: number): string {
    if (!source) return '';
    const builder = this.builder.image(source).auto('format');
    return width ? builder.width(width).url() : builder.url();
  }
}
`;

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully updated sanity.service.ts!');
