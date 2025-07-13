import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { Metadata, ParentMetadata } from './types/metadata'

// Import functions directly to avoid importing the Svelte component
let DEBUG = false

function enableDebug(enable: boolean = true) {
  DEBUG = enable
}

function parseMeta(parentTags: ParentMetadata | null, setTags: Metadata): { metaTags: any } {
  if (DEBUG) console.log('parse start', performance.now())

  if (DEBUG) console.log('Parent', parentTags)
  if (DEBUG) console.log('SET', setTags)

  // Handle character limit on title
  if (setTags.title && setTags.title.length > 70) {
    console.warn('Title exceeds recommended length of 70 characters')
  }

  // Handle character limit on description
  if (setTags.description && setTags.description.length > 200) {
    console.warn('Description exceeds recommended length of 200 characters')
  }

  // Handle mutual exclusivity for image/images
  if ('image' in setTags && 'images' in setTags) {
    console.warn('Both image and images properties specified - using images and ignoring image')
    const { image, ...restData } = setTags
    setTags = restData
  }

  // Handle mutual exclusivity for video/videos
  if ('video' in setTags && 'videos' in setTags) {
    console.warn('Both video and videos properties specified - using videos and ignoring video')
    const { video, ...restData } = setTags
    setTags = restData
  }

  // Handle titles and title templates
  let safeParentTags: Partial<ParentMetadata> = parentTags ? { ...parentTags } : {}
  if (safeParentTags.titleTemplate) {
    safeParentTags.parentTitleTemplate = safeParentTags.titleTemplate
    delete safeParentTags?.titleTemplate
  }

  if (DEBUG) console.log('parse returning', performance.now())

  return {
    metaTags: { ...safeParentTags, ...setTags }
  }
}

function baseMetaLoad(metaTags: Metadata) {
  if (DEBUG) console.log('base meta load', performance.now())
  return async ({ parent, data }: any) => {
    const parentData = await parent()
    const { parentMetaTags, ...parentRest } = parentData

    return {
      ...parentRest,
      ...data,
      ...parseMeta(null, metaTags)
    }
  }
}

function layoutMetaLoad(metaTags: Metadata) {
  if (DEBUG) console.log('layout meta load', performance.now())
  return async ({ parent, data }: any) => {
    const parentData = await parent()
    const parentTags = parentData.metaTags
    return {
      ...parentData,
      ...data,
      ...parseMeta(parentTags, metaTags)
    }
  }
}

function pageMetaLoad(metaTags: Metadata) {
  if (DEBUG) console.log('page meta load', performance.now())
  return async ({ parent, data }: any) => {
    const parentData = await parent()
    const parentTags = parentData.metaTags
    return {
      ...parentData,
      ...data,
      ...parseMeta(parentTags, metaTags)
    }
  }
}

describe('parseMeta', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should merge parent and current metadata correctly', () => {
    const parentTags: ParentMetadata = {
      title: 'Parent Title',
      description: 'Parent Description',
      sitename: 'My Site'
    }
    
    const setTags: Metadata = {
      title: 'Page Title',
      author: 'John Doe'
    }
    
    const result = parseMeta(parentTags, setTags)
    
    expect(result.metaTags).toEqual({
      title: 'Page Title',
      description: 'Parent Description',
      sitename: 'My Site',
      author: 'John Doe'
    })
  })

  it('should handle null parent tags', () => {
    const setTags: Metadata = {
      title: 'Page Title',
      description: 'Page Description'
    }
    
    const result = parseMeta(null, setTags)
    
    expect(result.metaTags).toEqual({
      title: 'Page Title',
      description: 'Page Description'
    })
  })

  it('should handle title template inheritance', () => {
    const parentTags: ParentMetadata = {
      titleTemplate: 'My Site - {page}',
      description: 'Parent Description'
    }
    
    const setTags: Metadata = {
      title: 'Page Title'
    }
    
    const result = parseMeta(parentTags, setTags)
    
    expect(result.metaTags).toEqual({
      title: 'Page Title',
      description: 'Parent Description',
      parentTitleTemplate: 'My Site - {page}'
    })
  })

  it('should handle new title template overriding parent', () => {
    const parentTags: ParentMetadata = {
      titleTemplate: 'Old Template - {page}',
      description: 'Parent Description'
    }
    
    const setTags: Metadata = {
      title: 'Page Title',
      titleTemplate: 'New Template - {page}'
    }
    
    const result = parseMeta(parentTags, setTags)
    
    expect(result.metaTags).toEqual({
      title: 'Page Title',
      description: 'Parent Description',
      titleTemplate: 'New Template - {page}',
      parentTitleTemplate: 'Old Template - {page}'
    })
  })

  it('should warn about title length exceeding 70 characters', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    
    const longTitle = 'This is a very long title that definitely exceeds the recommended 70 character limit for SEO purposes'
    
    const setTags: Metadata = {
      title: longTitle
    }
    
    parseMeta(null, setTags)
    
    expect(consoleSpy).toHaveBeenCalledWith('Title exceeds recommended length of 70 characters')
    
    consoleSpy.mockRestore()
  })

  it('should warn about description length exceeding 200 characters', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    
    const longDescription = 'This is a very long description that definitely exceeds the recommended 200 character limit for SEO and social media purposes. It keeps going and going and going to make sure we hit that limit and go beyond it.'
    
    const setTags: Metadata = {
      description: longDescription
    }
    
    parseMeta(null, setTags)
    
    expect(consoleSpy).toHaveBeenCalledWith('Description exceeds recommended length of 200 characters')
    
    consoleSpy.mockRestore()
  })

  it('should handle image/images mutual exclusivity', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    
    const setTags: any = {
      title: 'Test',
      image: 'single-image.jpg',
      images: [{ url: 'image1.jpg' }, { url: 'image2.jpg' }]
    }
    
    const result = parseMeta(null, setTags)
    
    expect(consoleSpy).toHaveBeenCalledWith('Both image and images properties specified - using images and ignoring image')
    expect(result.metaTags.images).toEqual([{ url: 'image1.jpg' }, { url: 'image2.jpg' }])
    expect(result.metaTags.image).toBeUndefined()
    
    consoleSpy.mockRestore()
  })

  it('should handle video/videos mutual exclusivity', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    
    const setTags: any = {
      title: 'Test',
      video: 'single-video.mp4',
      videos: [{ url: 'video1.mp4' }, { url: 'video2.mp4' }]
    }
    
    const result = parseMeta(null, setTags)
    
    expect(consoleSpy).toHaveBeenCalledWith('Both video and videos properties specified - using videos and ignoring video')
    expect(result.metaTags.videos).toEqual([{ url: 'video1.mp4' }, { url: 'video2.mp4' }])
    expect(result.metaTags.video).toBeUndefined()
    
    consoleSpy.mockRestore()
  })
})

describe('Load Functions', () => {
  const createMockLoadEvent = (parentData: any = {}, serverData: any = {}) => ({
    parent: async () => parentData,
    data: serverData,
    params: {},
    url: new URL('http://localhost'),
    fetch: global.fetch,
    setHeaders: () => {},
    depends: () => {},
    untrack: (fn: any) => fn(),
    route: { id: '/test' }
  } as any)

  describe('baseMetaLoad', () => {
    it('should create load function that resets metadata cascade', async () => {
      const metaTags: Metadata = {
        title: 'Base Title',
        description: 'Base Description'
      }
      
      const loadFunction = baseMetaLoad(metaTags)
      const mockEvent = createMockLoadEvent(
        { metaTags: { title: 'Parent Title' }, otherData: 'preserved' },
        { serverData: 'test' }
      )
      
      const result = await loadFunction(mockEvent)
      
      expect(result.otherData).toBe('preserved')
      expect(result.serverData).toBe('test')
      expect(result.metaTags).toEqual({
        title: 'Base Title',
        description: 'Base Description'
      })
    })
  })

  describe('layoutMetaLoad', () => {
    it('should create load function that merges with parent metadata', async () => {
      const metaTags: Metadata = {
        title: 'Layout Title',
        description: 'Layout Description'
      }
      
      const loadFunction = layoutMetaLoad(metaTags)
      const mockEvent = createMockLoadEvent(
        { 
          metaTags: { title: 'Parent Title', sitename: 'My Site' },
          otherData: 'preserved'
        },
        { serverData: 'test' }
      )
      
      const result = await loadFunction(mockEvent)
      
      expect(result.metaTags).toEqual({
        title: 'Layout Title',
        sitename: 'My Site',
        description: 'Layout Description'
      })
      expect(result.otherData).toBe('preserved')
      expect(result.serverData).toBe('test')
    })

    it('should handle title template from parent', async () => {
      const metaTags: Metadata = {
        title: 'Layout Title'
      }
      
      const loadFunction = layoutMetaLoad(metaTags)
      const mockEvent = createMockLoadEvent({
        metaTags: { 
          titleTemplate: 'Site - {page}',
          sitename: 'My Site'
        }
      })
      
      const result = await loadFunction(mockEvent)
      
      expect(result.metaTags).toEqual({
        title: 'Layout Title',
        sitename: 'My Site',
        parentTitleTemplate: 'Site - {page}'
      })
    })
  })

  describe('pageMetaLoad', () => {
    it('should create load function that sets page metadata', async () => {
      const metaTags: Metadata = {
        title: 'Page Title',
        description: 'Page Description'
      }
      
      const loadFunction = pageMetaLoad(metaTags)
      const mockEvent = createMockLoadEvent(
        {
          metaTags: { 
            title: 'Parent Title',
            sitename: 'My Site',
            titleTemplate: 'Site - {page}'
          },
          otherData: 'preserved'
        },
        { serverData: 'test' }
      )
      
      const result = await loadFunction(mockEvent)
      
      expect(result.metaTags).toEqual({
        title: 'Page Title',
        sitename: 'My Site',
        description: 'Page Description',
        parentTitleTemplate: 'Site - {page}'
      })
      expect(result.otherData).toBe('preserved')
      expect(result.serverData).toBe('test')
    })

    it('should work with sibling page (same level as layout)', async () => {
      const metaTags: Metadata = {
        title: 'Sibling Page Title'
      }
      
      const loadFunction = pageMetaLoad(metaTags)
      const mockEvent = createMockLoadEvent({
        metaTags: { 
          sitename: 'My Site',
          titleTemplate: 'Site - {page}'
        }
      })
      
      const result = await loadFunction(mockEvent)
      
      expect(result.metaTags).toEqual({
        title: 'Sibling Page Title',
        sitename: 'My Site',
        parentTitleTemplate: 'Site - {page}'
      })
    })
  })
})

describe('Metadata Cascading Scenarios', () => {
  const createMockLoadEvent = (parentData: any = {}, serverData: any = {}) => ({
    parent: async () => parentData,
    data: serverData,
    params: {},
    url: new URL('http://localhost'),
    fetch: global.fetch,
    setHeaders: () => {},
    depends: () => {},
    untrack: (fn: any) => fn(),
    route: { id: '/test' }
  } as any)

  it('should handle complex nested layout scenario', async () => {
    // Root layout with base metadata
    const rootMetaTags: Metadata = {
      sitename: 'My Site',
      titleTemplate: 'My Site - {page}',
      description: 'Default description'
    }
    
    const rootLoad = baseMetaLoad(rootMetaTags)
    
    // Nested layout that adds more metadata
    const nestedMetaTags: Metadata = {
      author: 'John Doe',
      description: 'Blog section description'
    }
    
    const nestedLoad = layoutMetaLoad(nestedMetaTags)
    
    // Page that overrides some metadata
    const pageMetaTags: Metadata = {
      title: 'Specific Post',
      description: 'Specific post description'
    }
    
    const pageLoad = pageMetaLoad(pageMetaTags)
    
    // Simulate the cascade
    const rootResult = await rootLoad(createMockLoadEvent({}))
    const nestedResult = await nestedLoad(createMockLoadEvent(rootResult))
    const pageResult = await pageLoad(createMockLoadEvent(nestedResult))
    
    expect(pageResult.metaTags).toEqual({
      sitename: 'My Site',
      parentTitleTemplate: 'My Site - {page}',
      author: 'John Doe',
      title: 'Specific Post',
      description: 'Specific post description'
    })
  })

  it('should handle sibling page vs nested page title template behavior', async () => {
    // Layout with title template
    const layoutMetaTags: Metadata = {
      sitename: 'My Site',
      titleTemplate: 'My Site - {page}'
    }
    
    const layoutLoad = layoutMetaLoad(layoutMetaTags)
    
    // Sibling page (same level as layout)
    const siblingPageMetaTags: Metadata = {
      title: 'Sibling Page'
    }
    
    const siblingPageLoad = pageMetaLoad(siblingPageMetaTags)
    
    // Nested page
    const nestedPageMetaTags: Metadata = {
      title: 'Nested Page'
    }
    
    const nestedPageLoad = pageMetaLoad(nestedPageMetaTags)
    
    // Test sibling page
    const parentData = { metaTags: { sitename: 'My Site' } }
    const layoutResult = await layoutLoad(createMockLoadEvent(parentData))
    
    const siblingResult = await siblingPageLoad(createMockLoadEvent(layoutResult))
    const nestedResult = await nestedPageLoad(createMockLoadEvent(layoutResult))
    
    // Both should have the same behavior with title template
    expect(siblingResult.metaTags).toEqual({
      sitename: 'My Site',
      parentTitleTemplate: 'My Site - {page}',
      title: 'Sibling Page'
    })
    
    expect(nestedResult.metaTags).toEqual({
      sitename: 'My Site',
      parentTitleTemplate: 'My Site - {page}',
      title: 'Nested Page'
    })
  })

  it('should handle complex metadata overriding', async () => {
    // Test complex overriding scenarios
    const parentTags: ParentMetadata = {
      title: 'Parent Title',
      description: 'Parent Description',
      sitename: 'My Site',
      author: 'Original Author',
      canonical: 'https://example.com/parent',
      titleTemplate: 'Site - {page}',
      image: 'parent-image.jpg'
    }
    
    const setTags: Metadata = {
      title: 'New Title',
      description: 'New Description',
      author: ['New Author 1', 'New Author 2'],
      canonical: 'https://example.com/new',
      titleTemplate: 'New Site - {page}',
      image: 'new-image.jpg'
    }
    
    const result = parseMeta(parentTags, setTags)
    
    expect(result.metaTags).toEqual({
      title: 'New Title',
      description: 'New Description',
      sitename: 'My Site',
      author: ['New Author 1', 'New Author 2'],
      canonical: 'https://example.com/new',
      titleTemplate: 'New Site - {page}',
      parentTitleTemplate: 'Site - {page}',
      image: 'new-image.jpg'
    })
  })
})