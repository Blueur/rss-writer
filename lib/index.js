var tab = "\t"

/**
 * creates a RSS String
 * @param {Object} channel - the channel from which the RSS will be generated
 */
function createRSS(channel) {
  return "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<rss version=\"2.0\" xmlns:atom=\"http://www.w3.org/2005/Atom\">\n\n" +
    xmlBlock("channel", channel.head.concat(channel.items), "") +
    "\n</rss>"
}

/**
 * creates an XML block
 * @param {String} markup - the markup of the element
 * @param {Array} contents - an array of the contents of the element
 * @param {String} indentation - the indentation of the element
 */
function xmlBlock(markup, contents, indentation) {
  return indentation + "<" + markup + ">\n" +
    contents.map(function(f) {return f(indentation + tab)}).join("") +
    indentation + "</" + markup + ">\n"
}

/**
 * creates an XML line
 * @param {String} markup - the markup of the element
 * @param {Array} content - the content of the element
 * @param {String} indentation - the indentation of the element
 */
function xmlLine(markup, content, indentation) {
  return indentation + "<" + markup + "><![CDATA[" + content + "]]></" + markup + ">\n"
}

/**
 * creates a new Channel
 * @param {Object} child - the non-item elements of the Channel
 */
function Channel(child) {
  var elements = []

  requireElement(elements, child.title, "title")
  requireElement(elements, child.link, "link")
  requireElement(elements, child.description, "description")
  optionalElement(elements, child.category, "category")
  optionalElement(elements, child.cloud, "cloud")
  optionalElement(elements, child.copyright, "copyright")
  optionalElement(elements, child.docs, "docs")
  optionalElement(elements, child.generator, "generator", "https://www.npmjs.com/package/rss-writer")
  imageElement(elements, child.image)
  optionalElement(elements, child.language, "language")
  optionalElement(elements, child.lastBuildDate, "lastBuildDate")
  optionalElement(elements, child.managingEditor, "managingEditor")
  optionalElement(elements, child.pubDate, "pubDate")
  optionalElement(elements, child.rating, "rating")
  optionalElement(elements, child.skipDays, "skipDays")
  optionalElement(elements, child.skipHours, "skipHours")
  //optionalElement(elements, child.textInput, "textInput")
  optionalElement(elements, child.ttl, "ttl")
  optionalElement(elements, child.webMaster, "webMaster")

  this.head = elements
  this.items = []

  this.createItem = function(child) {
    return newItem(child)
  }
  this.newItemFirst = function(child) {
    this.items.unshift(newItem(child))
  }
  this.newItemLast = function(child) {
    this.items.push(newItem(child))
  }
  this.generateRSS = function(){
    return createRSS(this)
  }

  return this
}

/**
 * returns a new item
 * @param {Object} child - the elements of the Item
 */
function newItem(child) {
  var elements = []
  requireElement(elements, child.title, "title")
  requireElement(elements, child.link, "link")
  requireElement(elements, child.description, "description")
  optionalElement(elements, child.author, "author")
  optionalElement(elements, child.category, "category")
  optionalElement(elements, child.comments, "comments")
  //optionalElement(elements, child.enclosure, "enclosure")
  optionalElement(elements, child.guid, "guid")
  optionalElement(elements, child.pubDate, "pubDate")
  //optionalElement(elements, child.source, "source")
  return function(indentation){
    return xmlBlock("item", elements, indentation)
  }
}

/**
 * adds a required element in the given array
 * @param {Array} elements - the array of elements
 * @param {String} content - the content of the element
 * @param {String} markup - the markup of the element
 */
function requireElement(elements, content, markup) {
  if (content) {
    elements.push(function(indentation) {
      return xmlLine(markup, content, indentation)
    })
  } else {
    throw "The " + markup + " is required."
  }
}

/**
 * adds an optional element in the given array
 * @param {Array} elements - the array of elements
 * @param {String} content - the content of the element
 * @param {String} markup - the markup of the element
 */
function optionalElement(elements, content, markup, defaultContent) {
  if (content) {
    elements.push(function(indentation) {
      return xmlLine(markup, content, indentation)
    })
  } else if (defaultContent) {
    elements.push(function(indentation) {
      return xmlLine(markup, defaultContent, indentation)
    })
  }
}

function imageElement(elements, image) {
  if (image) {
    var elements = []
    requireElement(elements, image.url, "url")
    requireElement(elements, image.title, "title")
    requireElement(elements, image.link, "link")
    optionalElement(elements, image.description, "description")
    optionalElement(elements, image.height, "height")
    optionalElement(elements, image.width, "width")
    elements.push(function(indentation) {
      return xmlBlock("image", elements, indentation)
    })
  }
}

module.exports = Channel;
