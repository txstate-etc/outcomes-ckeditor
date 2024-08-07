import { toWidget } from '@ckeditor/ckeditor5-widget'

function toTableWidget( viewElement, writer ) {
	writer.setCustomProperty( 'table', true, viewElement );

	return toWidget( viewElement, writer, { hasSelectionHandle: true } );
}

export function tableUpcast (dataFilter) {
  return ( evt, data, conversionApi ) => {    
    if (!data.modelRange) return
    const viewTableElement = data.viewItem
    const viewAttributes = {}

		for (const value of viewTableElement.getAttributes()) {
			viewAttributes[value[0]] = value[1]
		}

    if (viewAttributes?.class) {
      const classes = viewAttributes.class.replace('table', '').trim().split(' ')
      if (viewAttributes?.border === '1') classes.push('border')
      conversionApi.writer.setAttribute('class', classes.join(' '), data.modelRange)
    }

    if (viewAttributes?.style) {
			const styles = viewAttributes.style.split(';').reduce((acc, s) => {
				if (!s) return acc
				const style = s.split(':').map(s => s.trim())
				if (style.length < 1 || !style[1]) return acc
				acc[style[0]] = style[1]
				return acc
			}, {})

			conversionApi.writer.setAttribute('style', styles, data.modelRange)
		}
  }
}

export function downcastTable( tableUtils, options = {} ) {
  return ( table, { writer } ) => {
		const headingRows = table.getAttribute( 'headingRows' ) || 0;
		const tableSections = [];

		// Table head slot.
		if ( headingRows > 0 ) {
			tableSections.push(
				writer.createContainerElement( 'thead', null,
					writer.createSlot( element => element.is( 'element', 'tableRow' ) && element.index < headingRows )
				)
			);
		}

		// Table body slot.
		if ( headingRows < tableUtils.getRows( table ) ) {
			tableSections.push(
				writer.createContainerElement( 'tbody', null,
					writer.createSlot( element => element.is( 'element', 'tableRow' ) && element.index >= headingRows )
				)
			);
		}

		const figureElement = writer.createContainerElement( 'figure', { class: 'table border' }, [
			// Table with proper sections (thead, tbody).
			writer.createContainerElement( 'table', null, tableSections ),

			// Slot for the rest (for example caption).
			writer.createSlot( element => !element.is( 'element', 'tableRow' ) )
		] );

    return options.asWidget ? toTableWidget( figureElement, writer ) : figureElement;
	};
}
