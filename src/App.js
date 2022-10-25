import React, { Component } from "react";
import "./App.css";

import Form from "./components/Form";
//import TransformFunction from "./components/TransformFunction";


const transformFunction = (input) => {
  var fileJson = require('./test.json');
  var randIndex = Math.floor(Math.random() * fileJson.length);
  return fileJson[randIndex];
}
/*
String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}
*/
const splitOnce = (s, on) => {
  var [first, ...rest] = s.split(on);
  return [first, rest.length > 0? rest.join(on) : null];
}

const prepareColor = (medEntityType) => {
  if (medEntityType === 'Medication') {
    return 'green';
  }
  if (medEntityType === 'Disease') {
    return 'red';
  }
  if (medEntityType === 'ADR') {
    return 'blue';
  }
  if (medEntityType === 'Note') {
    return 'yellow';
  }
}

const checkOnlyOnce = (str, list) => {
    var i;
    for (i = 0; i < list.length; i++) {
      if (list[i].text.toLowerCase() === str.toLowerCase()) {
          return i;
      }
    }
}

const prepareInBrackets = (obj, str) => {
  if (obj.ATC) {
    return str + ` (${obj.ATC})`;
  }
  if (obj.MedDRA) {
    return str + ` (${obj.MedDRA})`;
  }
  if (obj.MKB10) {
    return str + ` (${obj.MKB10})`;
  }
  if (obj.source_group) {
    return str + ` (${obj.source_group})`;
  }
  if (obj.Medfrom_standart) {
    return str + ` (${obj.Medfrom_standart})`;
  }
  if (obj.MedMaker) {
    return str + ` (${obj.MedMaker})`;
  }
  if (obj.MedFrom) {
    return str + ` (${obj.MedFrom})`;
  }
  return str;
}

class App extends Component {

  state = {
    found: false,
    title: "",
    text: "",
    url: "",
    entities: [],
    tableData: {},
    error: undefined
  }

  gettingData = async (e) => {
    e.preventDefault();
    var input = e.target.elements.keyword.value;
    if (input){

      var reviewExample = transformFunction(input);
      const entities = Object.values(reviewExample.entities);
      var text = reviewExample.text;
      var totalArr = [];
      var totalObj = {};
      totalObj.Medication = {};
      totalObj.Disease = {};
      console.log(entities)

      const total = entities.map((obj) => {
        const markupColor = prepareColor(obj.MedEntityType);
        obj.spans.forEach(span => {
          const substr = reviewExample.text.substring(span.begin, span.end);
          if (text) {
            const dataArr = splitOnce(text, substr);
            totalArr.push(dataArr[0] + `<span class="text_${markupColor}">`+substr+'</span>');
            text = dataArr[1];
          }
        });

        if (obj.MedEntityType === "Medication") {
          obj.Context.map(context => {
            if (!totalObj.Medication[context]) {
              totalObj.Medication[context] = [];
            }
            const typePlusEntitie = obj.MedType + ': '  + prepareInBrackets(obj, `${obj.text}`);
            if (!totalObj.Medication[context].includes(typePlusEntitie)) {
              totalObj.Medication[context].push(typePlusEntitie);
            }
          })
        }

        if (obj.MedEntityType === "Disease") {
          obj.Context.map(context => {
            if (!totalObj.Disease[context]) {
              totalObj.Disease[context] = [];
            }
            const typePlusEntitie = obj.DisType + ': '  + prepareInBrackets(obj, `${obj.text}`);
            if (!totalObj.Disease[context].includes(typePlusEntitie)) {
              totalObj.Disease[context].push(typePlusEntitie);
            }
          })
        }

        /*
        if (obj.MedEntityType === "Medication") {
          if (totalObj.Medication[obj.MedType]) {
            var contextArr = totalObj.Medication[obj.MedType];
            obj.Context.map(context => {
              if (contextArr[context] && !contextArr[context].includes(obj.text)) {
                contextArr[context] += prepareInBrackets(obj, `, ${obj.text}`);
              } else {
                contextArr[context] = prepareInBrackets(obj, `${obj.text}`);
              }
            });
          } else {
            totalObj.Medication[obj.MedType] = [];
            var contextArr = totalObj.Medication[obj.MedType];
            obj.Context.map(context => {
              contextArr[context] = prepareInBrackets(obj, `${obj.text}`);
            });
          }
        }

        if (obj.MedEntityType === "Disease") {
          if (totalObj.Disease[obj.DisType]) {
            var contextArr = totalObj.Disease[obj.DisType];
            obj.Context.map(context => {
              if (contextArr[context] && !contextArr[context].includes(obj.text)) {
                contextArr[context] += prepareInBrackets(obj, `, ${obj.text}`);
              } else {
                contextArr[context] = prepareInBrackets(obj, `${obj.text}`);
              }
            });
          } else {
            totalObj.Disease[obj.DisType] = [];
            var contextArr = totalObj.Disease[obj.DisType];
            obj.Context.map(context => {
              contextArr[context] = prepareInBrackets(obj, `${obj.text}`);
            });
          }
        }
        */
        /*
        obj.Context.map(context => {
          if (obj.MedEntityType === "Medication") {
            if (obj.MedType === "Drugname") {
              totalObj.Drugname[context-1] = obj.text;
            }
          }
        });
        */

      });
      const result = totalArr.join('');
      const resultSplit = result.split('\n', 5);
      console.log(totalObj)
      //console.log(result2);
      //Object.entries(this.state.tableData).map((key, value) => ( console.log(key)));
      //console.log(typeof totalObj.Medication)
      /*
      Object.entries(totalObj.Medication).map(([key, value]) => {
        Object.entries(value).map(([k, v]) => console.log(`${key}: ${v}`))
      })
      */
      this.setState({
        found: true,
        title: resultSplit[2],
        text: resultSplit[4],
        url: resultSplit[0],
        entities: entities,
        tableData: totalObj,
        error: undefined
      });

    } else {
      this.setState({
        found: false,
        title: "",
        text: "",
        url: "",
        entities: [],
        tableData: {},
        error: "Введите текст отзыва"
      });
    }
  }

  /*                Object.entries(value).map(([k, v]) => (
                      <tr key={key+k}>
                        <td></td>
                        <td>{key}: {v}</td>
                        <td></td>
                        <td></td>
                      </tr>
                  ))*/
  render() {
    return(
      <div className="wrapper">
        <div className="flex-container">
          <h1> Med-demo </h1>
          <Form TransformText={this.gettingData}/>
          <div>
            { this.state.found &&
              <div>

                <div className="reviewtext">
                  <p>
                    <b dangerouslySetInnerHTML={{ __html: this.state.title }}/>
                  </p>
                  <div dangerouslySetInnerHTML={{ __html: this.state.text }}/>
                  <p> <a href={this.state.url}> {this.state.url} </a> </p>
                </div>
              </div>
            }
            <p> {this.state.error} </p>
          </div>

          { this.state.found &&
            <div >
              <table align="center">
                <thead>
                  <tr>
                    <th>Medication</th>
                    <th>Disease</th>
                    <th>ADR</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                <>
                {
                  Object.entries(this.state.tableData.Medication).map(([key, value]) => (
                    <tr>
                      <td>
                        {Object.entries(value).map(([k,v]) => (
                              <p>{v}</p>
                        ))}
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  ))
                }
                </>
                <>
                {
                  Object.entries(this.state.tableData.Disease).map(([key, value]) => (
                    <tr>
                      <td></td>
                      <td>
                        {Object.entries(value).map(([k,v]) => (
                              <p>{v}</p>
                        ))}
                      </td>
                      <td></td>
                      <td></td>
                    </tr>
                  ))

                }
                </>
                <>
                {this.state.entities.map((item, index1) => ((checkOnlyOnce(item.text, this.state.entities)===index1) && (item.Context.map((c) => (
                  (item.MedEntityType === "ADR" || item.MedEntityType === "Note") && (
                  <tr key={index1+c}>
                    <td>  </td>
                    <td>  </td>
                    <td> {item.MedEntityType === "ADR" ? prepareInBrackets(item, item.text) : ""} </td>
                    <td> {item.MedEntityType === "Note" ? prepareInBrackets(item, item.text) : ""} </td>
                  </tr>
                )))))
                )}
                </>
                </tbody>
              </table>
            </div>
          }

        </div>
        {/*
          {this.state.entities.map((item, index1) => ((checkOnlyOnce(item.text, this.state.entities)===index1) && (item.Context.map((c) => (
            <tr key={index1+c}>
              <td>
              {item.MedEntityType === "Medication" &&
                <>
                  {item.MedType === "Drugname" ? "Drugname: "+item.text : item.MedType === "SourceInfodrug" ? "SourceInfodrug: "+item.text : ""}
                </>
              }
              </td>
              <td>
                {item.MedEntityType === "Disease" &&
                  <>
                    {item.DisType === "Diseasename" ? "Diseasename: "+item.text : item.DisType === "Indication" ? "Indication: "+item.text : ""}
                  </>
                }
              </td>
              <td> {item.MedEntityType === "ADR" ? item.text : ""} </td>
              <td> {item.MedEntityType === "Note" ? item.text : ""} </td>
            </tr>
          ))))
          )}
        */}
      </div>
    );
  }
}

export default App;
