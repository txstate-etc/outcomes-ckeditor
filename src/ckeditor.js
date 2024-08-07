/**
 * @license Copyright (c) 2014-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor.js'
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment'
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat.js'
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote.js'
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold.js'
import Code from '@ckeditor/ckeditor5-basic-styles/src/code.js'
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript.js'
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript.js'
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough.js'
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials.js'
import Font from '@ckeditor/ckeditor5-font/src/font'
import GeneralHtmlSupport from '@ckeditor/ckeditor5-html-support/src/generalhtmlsupport'
import Heading from '@ckeditor/ckeditor5-heading/src/heading.js'
import HorizontalLine from '@ckeditor/ckeditor5-horizontal-line/src/horizontalline'
import {
  Image,
  ImageCaption,
  ImageStyle,
  ImageToolbar,
  ImageResize
} from '@ckeditor/ckeditor5-image'
import Indent from '@ckeditor/ckeditor5-indent/src/indent.js'
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic.js'
import List from '@ckeditor/ckeditor5-list/src/list.js'
import Link from '@ckeditor/ckeditor5-link/src/link.js'
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph.js'
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice.js'
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat'
import { SourceEditing } from '@ckeditor/ckeditor5-source-editing'
import SpecialCharacters from '@ckeditor/ckeditor5-special-characters/src/specialcharacters'
import SpecialCharactersEssentials from '@ckeditor/ckeditor5-special-characters/src/specialcharactersessentials'
import Table from '@ckeditor/ckeditor5-table/src/table.js'
import TableCellProperties from './Tablecellproperties/tableCellProperties'
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar.js'
import CustomTableToolbar from './Table/CustomTableToolbar.js'
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation.js'
import Undo from '@ckeditor/ckeditor5-undo/src/undo'
import TableProperties from './Table/TablePropertiesUI-plugin.js'
import { htmlSupport } from './utils/defaultConfigs.js'
import './ckeditor.css'

class Editor extends ClassicEditor {}

// Plugins to include in the build.
Editor.builtinPlugins = [
  Alignment,
  Autoformat,
  BlockQuote,
  Bold,
  Code,
  CustomTableToolbar,
  Essentials,
  Font,
  GeneralHtmlSupport,
  Heading,
  HorizontalLine,
  Image,
  ImageCaption,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  Indent,
  Italic,
  Link,
  List,
  Paragraph,
  PasteFromOffice,
  RemoveFormat,
  SourceEditing,
  SpecialCharacters,
  SpecialCharactersEssentials,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  TableCellProperties,
  TableProperties,
  TableToolbar,
  TextTransformation,
  Undo
]

const extraConfig = {
  toolbar: {
    items: [
      'bold',
      'italic',
      'strikethrough',
      'superscript',
      'subscript',
      'code',
      'removeFormat',
      '|',
      'horizontalLine',
      'blockQuote',
      'specialCharacters',
      '|',
      'link',
      'anchor',
      '|',
      'insertTable',
      '|',
      'assetBrowserImage',
      '|',
      'undo',
      'redo',
      '-',
      'sourceEditing',
      '|',
      'alignment',
      'numberedList',
      'bulletedList',
      'indent',
      'outdent',
      '|',
      'heading',
      '|',
      'fontColor'
    ],
    shouldNotGroupWhenFull: true
  },
  image: {
    toolbar: [
      'imageStyle:inline',
      'imageStyle:wrapText',
      'imageStyle:breakText',
      '|',
      'toggleImageCaption',
      'imageTxtAlternative'
    ]
  },
  fontColor: {
    colors: ['#222222', '#465147', '#654D3C', '#7D2F19', '#764A33', '#b30e1b']
  },
  table: {
    contentToolbar: ['tableProperties', 'customTableColumn', 'customTableRow', 'mergeTableCells', 'tableCellProperties'],
    tableProperties: {
      tableWidth: [
        { label: '100%', value: 'full-width' },
        { label: 'Auto', value: 'auto-width' }
      ],
      tableHeaders: [
        { label: 'None', value: 'none' },
        { label: 'First Row', value: 'row' },
        { label: 'First Column', value: 'column' },
        { label: 'Both', value: 'both' }
      ],
      tableHeaderColors: [
        { label: 'None', value: 'header-color-none' },
        { label: 'Coffee', value: 'header-color-coffee', default: true },
        { label: 'Cactus', value: 'header-color-cactus' },
        { label: 'Tumbleweed', value: 'header-color-tumbleweed' },
        { label: 'Silver', value: 'header-color-silver' },
        { label: 'Sienna', value: 'header-color-sienna' },
        { label: 'Pale Brown', value: 'header-color-palebrown' },
        { label: 'Maize', value: 'header-color-maize' }
      ],
      templateColorLabel: 'Wittliff Colors',
    },
    tableCellProperties: {
      defaultProperties: {
        includeVerticalAlignmentProperty: false,
				includeHorizontalAlignmentProperty: false,
				includePaddingProperty: false,
      },
      backgroundColors: [
        { label: 'Cactus', color: '#465147' },
        { label: 'Coffee', color: '#654D3C' },
        { label: 'Tumbleweed', color: '#C69D77' },
        { label: 'Silver', color: '#C8BEB7' },
        { label: 'Sienna', color: '#7D2F19' },
        { label: 'Pale Brown', color: '#764A33' },
        { label: 'Maize', color: '#F3C9A3' }
      ]
    }
  }
}

const defaultConfig = {
  heading: {
    options: [
      { title: 'Paragraph', model: 'paragraph', class: 'ck-heading_paragraph' },
      { title: 'Title', view: 'h2', model: 'heading2', class: 'ck-heading_heading2' },
      { title: 'Subtitle', view: 'h3', model: 'heading3', class: 'ck-heading_heading3' },
      { title: 'Subsubtitle', view: 'h4', model: 'heading4', class: 'ck-heading_heading4' },
      { title: 'Preformatted Text', view: 'pre', model: 'preformattedText', class: 'ck-heading-preformattedText' }
    ]
  },
  htmlSupport: {
    allow: htmlSupport
  },
  language: 'en',
  ...extraConfig
}


Editor.defaultConfig = defaultConfig

export default Editor
