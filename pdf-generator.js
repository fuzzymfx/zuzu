import { mdToPdf } from 'md-to-pdf'
import path from 'path'
export const getOutputPdfname = (filename, outPath) => {
    const basename = path.basename(filename)
    const newfilename = basename.substring(0, basename.length - 3) + '.pdf'
    const outfile = path.join(outPath, newfilename)
    return outfile
}
export const generatePDF = async(filename, outpdfname) => {
    await mdToPdf({ path: filename }, { dest: outpdfname });
}