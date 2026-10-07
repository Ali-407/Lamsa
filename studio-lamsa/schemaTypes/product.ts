import { defineArrayMember, defineField, defineType } from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    defineField({
      name: 'scentFamily',
      title: 'Scent Family',
      type: 'string',
      options: {
        list: [
          { title: 'Floral', value: 'floral' },
          { title: 'Oriental', value: 'oriental' },
          { title: 'Woody', value: 'woody' },
          { title: 'Fresh', value: 'fresh' },
          { title: 'Citrus', value: 'citrus' },
          { title: 'Aquatic', value: 'aquatic' },
          { title: 'Gourmand', value: 'gourmand' },
          { title: 'Fougère', value: 'fougere' },
        ],
      },
    }),
    defineField({
      name: 'volume',
      title: 'Volume',
      type: 'string',
      options: {
        list: [
          { title: '30ml', value: '30ml' },
          { title: '50ml', value: '50ml' },
          { title: '75ml', value: '75ml' },
          { title: '100ml', value: '100ml' },
          { title: '150ml', value: '150ml' },
        ],
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'featured',
      title: 'Featured Product',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'price',
      media: 'images.0',
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? `${subtitle} EGP` : 'No price',
        media,
      }
    },
  },
})
