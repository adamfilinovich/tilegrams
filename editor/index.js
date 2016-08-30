require("./source/css/main.scss")

import data from './source/Data'
import canvas from './source/Canvas'
import ui from './source/Ui'
import exporter from './source/file/Exporter'
import mapData from './source/MapData'

import {onExportTopoJson} from './source/constants'
import {startDownload} from './source/utils'

// wire up callbacks
canvas.getGrid().onChange(() => updateUi())
ui.setAddTileCallback(event => canvas.getGrid().onAddTileMouseDown(event))
ui.setDatasetSelectedCallback(index => selectDataset(data.getDataset(index)))
ui.setCustomDatasetCallback(csv => selectDataset(data.parseCsv(csv)))

// populate
ui.setGeos(mapData.getUniqueFeatureIds())
ui.setDatasetLabels(data.getLabels())
selectDataset(data.getDataset(0))
updateUi()

function selectDataset(dataset) {
  ui.setSelectedDataset(dataset)
  canvas.computeCartogram({
    topoJson: mapData.getTopoJson(),
    properties: dataset,
  })
}

function updateUi() {
  ui.render(
    canvas.getGrid().getTiles(),
    canvas.getGrid().getOriginalTilesLength()
  )
}

onExportTopoJson(() => {
  const json = exporter.formatTopoJson(canvas.getGrid().getTiles())
  startDownload({
    filename: 'hexagon-cartogram.json',
    mimeType: 'application/json',
    content: JSON.stringify(json),
  })
})
