const visit = require('unist-util-visit')

const processRepoImageUrlsInContent = (mdast, fn) => {
  visit(mdast, 'image', node => {
    node.url = fn(node.url)
  })
}

const processRepoImageUrlsInMeta = (mdast, fn) => {
  if (mdast.meta) {
    Object.keys(mdast.meta).forEach(key => {
      if (key.match(/image/i)) {
        mdast.meta[key] = fn(mdast.meta[key])
      }
    })
    const series = mdast.meta.series
    if (series && Array.isArray(series.episodes)) {
      series.episodes.forEach(episode => {
        if (episode.image) {
          episode.image = fn(episode.image)
        }
      })
    }
  }
}

// TODO migrate if embeds moved into it's own module
const embedImageKeys = ['userProfileImageUrl', 'image', 'thumbnail']

const processImageUrlsInContent = (mdast, fn) => {
  visit(mdast, 'zone', node => {
    if (node.data && node.identifier.indexOf('EMBED') > -1) {
      for (let key of embedImageKeys) {
        if (node.data[key]) {
          node.data[key] = fn(node.data[key])
        }
      }
    }
  })
}

module.exports = {
  processRepoImageUrlsInContent,
  processRepoImageUrlsInMeta,
  processImageUrlsInContent
}
