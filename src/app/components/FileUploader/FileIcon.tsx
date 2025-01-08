import {
  AiFillFilePdf,
  AiFillFileMarkdown,
  AiFillFileExcel,
  AiFillFileWord,
  AiFillFileUnknown
} from 'react-icons/ai'
import { FaFigma } from 'react-icons/fa'

interface FileIconProps {
  fileType: string
}

const FileIcon: React.FC<FileIconProps> = ({ fileType }) => {
  const getIconByFileType = (fileType: string) => {
    switch (fileType) {
      case '.pdf':
        return <AiFillFilePdf size={48} color="red" />
      case '.fig':
        return <FaFigma size={48} color="purple" />
      case '.md':
        return <AiFillFileMarkdown size={48} color="gray" />
      case '.xlsx':
      case '.xls':
        return <AiFillFileExcel size={48} color="green" />
      case '.doc':
      case '.docx':
        return <AiFillFileWord size={48} color="blue" />
      default:
        return <AiFillFileUnknown size={48} color="black" />
    }
  }

  return <div>{getIconByFileType(fileType)}</div>
}

export { FileIcon }
