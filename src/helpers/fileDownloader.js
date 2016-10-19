import FileSaver from 'file-saver';

export default function downloadFile(text, extension = 'txt', filename = 'my_bulgur') {
  const blob = new Blob([text], {type: 'text/plain;charset=utf-8'});
  FileSaver.saveAs(blob, filename + '.' + extension);
}
