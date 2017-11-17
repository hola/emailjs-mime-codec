import { TextDecoder, TextEncoder } from 'text-encoding'
import { fromTypedArray } from './mimecodec'

/**
 * Encodes an unicode string into an Uint8Array object as UTF-8
 *
 * @param {String} str String to be encoded
 * @return {Uint8Array} UTF-8 encoded typed array
 */
export const encode = str => new TextEncoder('UTF-8').encode(str)

/**
 * Decodes a string from Uint8Array to an unicode string using specified encoding
 *
 * @param {Uint8Array} buf Binary data to be decoded
 * @param {String} Binary data is decoded into string using this charset
 * @return {String} Decded string
 */
export function decode (buf, fromCharset = 'utf-8') {
  const charsets = [
    { charset: normalizeCharset(fromCharset), fatal: true },
    { charset: 'utf-8', fatal: true },
    { charset: 'iso-8859-15', fatal: false }
  ]

  for (const {charset, fatal} of charsets) {
    try { return new TextDecoder(charset, { fatal }).decode(buf) } catch (e) { }
  }

  return fromTypedArray(buf)
}

/**
 * Convert a string from specific encoding to UTF-8 Uint8Array
 *
 * @param {String|Uint8Array} data Data to be encoded
 * @param {String} Source encoding for the string (optional for data of type String)
 * @return {Uint8Array} UTF-8 encoded typed array
 */
export const convert = (data, fromCharset) => typeof data === 'string' ? encode(data) : encode(decode(data, fromCharset))

function normalizeCharset (charset = 'utf-8') {
  let match

  if ((match = charset.match(/^utf[-_]?(\d+)$/i))) {
    return 'UTF-' + match[1]
  }

  if ((match = charset.match(/^win[-_]?(\d+)$/i))) {
    return 'WINDOWS-' + match[1]
  }

  if ((match = charset.match(/^latin[-_]?(\d+)$/i))) {
    return 'ISO-8859-' + match[1]
  }

  return charset
}