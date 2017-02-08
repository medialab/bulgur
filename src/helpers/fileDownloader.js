/**
 * This module handles downloading a file from string content
 * @module bulgur/utils/fileDownloader
 */
import FileSaver from 'file-saver';
/**
 * @param {string} text - the text to put in the file
 * @param {string} extension - the extension to append to file name
 * @param {string} fileName - the name to attribute to the downloaded file
 */
export default function downloadFile(text, extension = 'txt', fileName = 'bulgur') {
  const blob = new Blob([text], {type: 'text/plain;charset=utf-8'});
  FileSaver.saveAs(blob, fileName + '.' + extension);
}
