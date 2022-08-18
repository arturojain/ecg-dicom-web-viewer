import Constants from "../constants/Constants";
import ReadECGData from "../utils/ReadECGData";
import DrawECGCanvas from "../draw/DrawECGCanvas";
import './Style.css';
/**
 * Princial Class to render ECG viewer.
 */
class DicomECGViewer {
  private dataDICOMarrayBuffer: ArrayBuffer;
  private idView: string;
  private nameView: string;
  /**
   * Create Viwer
   * @param {*} dataDICOMarrayBuffer DICOM DCM ECG Array Buffer.
   * @param {*} idView Draw ID View.
   * @param {*} nameView Identifier of the view you want to put, in case you have several views, default 0.
   */
  constructor(
    dataDICOMarrayBuffer: ArrayBuffer,
    idView: string,
    nameView: "0"
  ) {
    this.dataDICOMarrayBuffer = dataDICOMarrayBuffer;
    this.idView = idView;
    this.nameView = nameView;
  }

/**
 * Load canva data.
 */
  loadCanvas() {
    try{
      
      //DataSet:
      let dataSet = ReadECGData.getDataSet(this.dataDICOMarrayBuffer);
      //Read data from dataSet:
      let dataMg = ReadECGData.readData(dataSet);

      //Load DOM canva and load user data:
      this.loadCanvasDOM(dataMg.patientName, dataMg.patientID, dataMg.sex, dataMg.bithDate, dataMg.studyDate, dataMg.patientAge, dataMg.patientSize, dataMg.patientWeight); 

      //Draw template:
      let ecgCanvas = new DrawECGCanvas(this.idView + this.nameView, dataMg);

      //Draw compatible:
      switch (dataMg.sopClassUID) {
        case Constants.SOP_CLASS_UIDS.HemodynamicWaveformStorage: //Hemodynamic Waveform Storage
          ecgCanvas.drawGrid();
          ecgCanvas.drawECG();
          break;
        case Constants.SOP_CLASS_UIDS.AmbulatoryECGWaveformStorage: //Ambulatory
          ecgCanvas.drawNoCompatible();
          break;
        case Constants.SOP_CLASS_UIDS.GeneralECGWaveformStorage: //General ECG Waveform Storage
          ecgCanvas.drawGrid();
          ecgCanvas.drawECG();
          break;
        case Constants.SOP_CLASS_UIDS.Sop12LeadECGWaveformStorage: //12-lead ECG Waveform Storage
          ecgCanvas.drawGrid();
          ecgCanvas.drawECG();
          break;
        default:
          ecgCanvas.drawNoCompatible();
          console.log("Unsupported SOP Class UID: " + dataMg.sopClassUID);
      }
    } catch (err) {
      //gridCanvas.drawNoCompatible();
    }
  }

  /**
   * Create struct of view.
   */
  loadCanvasDOM(name, id, sex, birth, study, age, size, weight) {
    let view = "";
    document.getElementById(this.idView).innerHTML = view;
    view = 
    '<div class="divTableBody">' +
    '<div class="divTableRow">' +
    '<div class="divTableCell">NAME: <i>' +
    name +
    "</i></div>" +
    '<div class="divTableCell">SEX: <i>' +
    sex+
    "</i></div>" +
    '<div class="divTableCell">PATIENT SIZE: <i>' +
    size +
    "</i></div>" +
    "</div>" +
    '<div class="divTableRow">' +
    '<div class="divTableCell">PATIENT ID: <i>' +
    id +
    "</i></div>" +
    '<div class="divTableCell">PATIENT AGE: <i>' +
    age +
    "</i></div>" +
    '<div class="divTableCell">PATIENT WEIGHT: <i>' +
    weight +
    "</i></div>" +
    "</div>" +
    '<div class="divTableRow">' +
    '<div class="divTableCell">DATE: <i>' +
    study +
    "</i></div>" +
    '<div class="divTableCell">BIRTH: <i>' +
    birth +
    "</i></div>" +
    "</div>" +
    "</div>" + 
    '<canvas id="' + this.idView + this.nameView + '" style="border-top: 2px solid #000000; border-bottom: 2px solid #000000;"></canvas>';

    document.getElementById(this.idView).innerHTML = view;
  }


}
export default DicomECGViewer;
