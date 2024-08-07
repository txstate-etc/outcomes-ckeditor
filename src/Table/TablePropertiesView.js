import { icons } from '@ckeditor/ckeditor5-core'
import { View, ButtonView, ViewCollection, FocusCycler, FormHeaderView, submitHandler } from '@ckeditor/ckeditor5-ui'
import FormRowView from '@ckeditor/ckeditor5-table/src/ui/formrowview'
import { FocusTracker, KeystrokeHandler } from '@ckeditor/ckeditor5-utils'
import { createDropdown } from '../utils/helpers'
export default class TablePropertiesView extends View {

  constructor (locale, options) {
    super(locale)

    this.set({
      tableHeaderColors: '',
      tableWidth: '',
      tableHeaders: '',
      tableBorder: '',
      tableAltBGColor: ''
    })

    this.options = options

    const { saveButtonView, cancelButtonView} = this._createActionButtons()

    this.saveButtonView = saveButtonView
    
    this.cancelButtonView = cancelButtonView

    const { headersDropdownView, tableHeaderColorsDropdownView } = this._createHeaderButtons()

    this.headersDropdownView = headersDropdownView

    this.tableHeaderColorDropdownView = tableHeaderColorsDropdownView

    const { borderButtonView, altBGButtonView } = this._createToggleButtons()

    this.borderButtonView = borderButtonView

    this.altBGButtonView = altBGButtonView

    const tableWidthsDropdown = createDropdown(this, { key: 'tableWidth', label: 'Table Width', items: this.options.tableWidth })

    this.tableWidthsDropdown = tableWidthsDropdown
    
    this.focusTracker = new FocusTracker()
    
    this.keystrokes = new KeystrokeHandler()
    
    this.children = this.createCollection()

    this._focusables = new ViewCollection()

    this._focusCycler = new FocusCycler({
      focusables: this._focusables,
      focusTracker: this.focusTracker,
      keystrokeHandler: this.keystrokes,
      actions: {
        // Navigate form fields backwards using Shift + Tab keystroke
        focusPrevious: 'shift + tab',
        // Navigate form fields forwards using the Tab key
        focusNext: 'tab'
      }
    })

    this.children.add(new FormHeaderView(locale, {
      label: this.t('Table Properties')
    }))

    this.children.add(new FormRowView(locale, {
      children: [
        this.headersDropdownView,
        this.tableHeaderColorDropdownView
      ],
      class: 'ck-table-form__border-row'
    }))

    this.children.add(new FormRowView(locale, {
      children: [
        this.tableWidthsDropdown,
      ],
      class: 'ck-table-form__border-row'
    }))

    this.children.add(new FormRowView(locale, {
      children: [
        this.borderButtonView,
        this.altBGButtonView
      ],
      class: 'ck-table-form__border-row'
    }))

    // Action row.
		this.children.add( new FormRowView(locale, {
			children: [
				this.saveButtonView,
				this.cancelButtonView
			],
			class: 'ck-table-form__action-row'
		}))

    this.setTemplate({
      tag: 'form',
      attributes: {
        class: [
          'ck',
          'ck-form',
          'ck-table-form',
          'ck-table-cell-pr'
        ],
        tabindex: '-1'
      },
      children: this.children
    })

    this._validate()
  }

  render () {
    super.render()

    // Enable the "submit" event for this view. It can be triggered by the #saveButtonView
		// which is of the "submit" DOM "type".
    submitHandler({ view: this })

    const views = [this.headersDropdownView, this.tableHeaderColorDropdownView, this.tableWidthsDropdown, this.borderButtonView, this.altBGButtonView, this.saveButtonView, this.cancelButtonView]

    views.forEach(view => {
		// 	// Register the view as focusable.
			this._focusables.add( view );

			// Register the view in the focus tracker.
			this.focusTracker.add( view.element );
		})

    // Mainly for closing using "Esc" and navigation using "Tab"
    this.keystrokes.listenTo(this.element)
  }

  destroy () {
    super.destroy()

    this.focusTracker.destroy()
    this.keystrokes.destroy()
  }

  focus () {
    this._focusCycler.focusFirst()
  }

  _validate () {
    this.on('change:tableHeaders', (evt, name, newValue) => {
      const colors = this.options.tableHeaderColors
      if (newValue.includes('none')) {
        const none = colors.find(({ label, value }) => value.toLowerCase().includes('none') || label.toLowerCase().includes('none'))
        if (none) this.tableHeaderColors = none.value
        else this.tableHeaderColors = ''
      } else if (this.tableHeaderColors.includes('none')) {
        const defaultColor = colors.find(({ label, value, default: d }) => d || value.toLowerCase().includes('default') || label.toLowerCase().includes('default'))
        if (defaultColor) {
          this.tableHeaderColors = defaultColor.value
        } else if (this.colors.length) this.tableHeaderColors = colors[0].value
      }
    })
  }

  _createHeaderButtons () {
    return {
      headersDropdownView: createDropdown(this, { key: 'tableHeaders', label: 'Headers', items: this.options.tableHeaders }),
      tableHeaderColorsDropdownView: createDropdown(this, { key: 'tableHeaderColors', label: 'Header Colors', items: this.options.tableHeaderColors })
    }
  }

  _createActionButtons () {
    const locale = this.locale
    const t = this.t
    const saveButtonView = new ButtonView(locale)
    const cancelButtonView = new ButtonView(locale)

    saveButtonView.set({
      label: t('Save'),
      icon: icons.check,
      class: 'ck-button-save',
      type: 'submit',
      withText: true
    })

    cancelButtonView.set({
      label: t('Cancel'),
      icon: icons.cancel,
      class: 'ck-button-cancel',
      withText: true
    })

    cancelButtonView.delegate('execute').to(this, 'cancel')

    return {
      saveButtonView, cancelButtonView
    }
  }

  _createToggleButtons () {
    const t = this.t
    const locale = this.locale

    const borderButtonView = new ButtonView(locale)
    const altBGButtonView = new ButtonView(locale)

    borderButtonView.set({
      label: t('Border'),
      withText: true,
      isToggleable: true
    })

    altBGButtonView.set({
      label: t('Alternating Background'),
      withText: true,
      isToggleable: true
    })

    borderButtonView.bind('isOn').to(this, 'tableBorder', value => {
			return !!value
    })

    altBGButtonView.bind('isOn').to(this, 'tableAltBGColor', value => {
      return !!value
    })

    borderButtonView.on('execute', () => {
      this.tableBorder = borderButtonView.isOn ? '' : 'border'
    })

    altBGButtonView.on('execute', () => {
      this.tableAltBGColor = altBGButtonView.isOn ? '' : 'alternate-row-color'
    })

    return {
      borderButtonView,
      altBGButtonView
    }
  }
}

