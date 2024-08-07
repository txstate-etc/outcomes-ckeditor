import { LabeledFieldView, Model, addListToDropdown, createLabeledDropdown } from '@ckeditor/ckeditor5-ui'
import { Collection } from '@ckeditor/ckeditor5-utils'

/**
 * Depending on the position of the selection we either return the table under cursor or look for the table higher in the hierarchy.
 *
 * @param {module:engine/model/position~Position} position
 * @returns {module:engine/model/element~Element}
 */
 export function getSelectionAffectedTable (selection) {
  const selectedElement = selection.getSelectedElement()

  // Is the command triggered from the `tableToolbar`?
  if (selectedElement && selectedElement.is('element', 'table')) {
    return selectedElement
  }

  return selection.getFirstPosition().findAncestor('table')
}

export function findAnchorElementAncestor( position ) {
	return position.getAncestors().find( ancestor => isAnchorElement( ancestor ) );
}

export function isAnchorElement( modelElement ) {
	return !!modelElement && modelElement.is( 'element', 'anchorId' )
}

export function hasAnchorProperty (node) {
  return !!node && node.getCustomProperty('anchor')
}


export function getLabels (t, c) {
  return c.reduce((acc, curr) => {
    acc[curr.value] = t(curr.label)
    return acc
  }, {})
}

export function createDropdown (view, { key, label, items }) {
  const locale = view.locale
  const t = view.t
  
  const headerView = new LabeledFieldView(locale, createLabeledDropdown)

  const labels = getLabels(t, items)

  headerView.set({
    label: t(label)
  })

  headerView.fieldView.buttonView.set({
    label: t(label),
    isOn: false,
    withText: true,
  })

  headerView.fieldView.buttonView.bind('label').to( view, key, value => {
    return labels[value] || Object.values(labels)[0]
  })

  headerView.fieldView.on('execute', evt => {
    view[key] = evt.source.commandParam
  })
  
  headerView.bind('isEmpty').to(view, key, value => !value)

  addListToDropdown(
    headerView.fieldView,
    getDropdownItemsDefinitions(t, items)
  )

  return headerView
}


export function getDropdownItemsDefinitions (t, items) {
  const itemDefinitions = new Collection()
  const labels = getLabels(t, items)

  for (const item in labels) {
    const definition = {
      type: 'button',
      model: new Model({
        commandParam: item,
        label: labels[item],
        withText: true
      })
    }

    // Add the item definition to the collection.
    itemDefinitions.add(definition)
  }

  return itemDefinitions
}
