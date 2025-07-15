// Test file to verify type checking works correctly
import { metaLoad, metaLoadWithData, addMetaTags } from 'sveltekit-meta'

// This should work - layout can use titleTemplate
const layoutExample = metaLoad.layout({
  title: 'Blog',
  titleTemplate: { route: '/blog', template: 'Blog: {page}' }
})

// This should work - page cannot use titleTemplate (type error)
// @ts-expect-error - titleTemplate should not be allowed in page metadata
const pageExample = metaLoad.page({
  title: 'My Post',
  titleTemplate: { route: '/blog', template: 'Blog: {page}' }
})

// This should work - page metadata without titleTemplate
const validPageExample = metaLoad.page({
  title: 'My Post',
  description: 'A great post'
})

console.log('Type checking works correctly!') 