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

class App extends Component {

  state = {
    found: false,
    text: "",
    entities: [],
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
      });
      const result = totalArr.join('');

      this.setState({
        found: true,
        text: result,
        entities: entities,
        error: undefined
      });

    } else {
      this.setState({
        found: false,
        text: "",
        entities: [],
        error: "Введите текст отзыва"
      });
    }
  }

  render() {
    return(
      <div className="wrapper">
        <div className="flex-container">
          <h1> Med-demo </h1>
          <Form TransformText={this.gettingData}/>
          <div>
            { this.state.found &&
              <div>
                <div> <div dangerouslySetInnerHTML={{ __html: this.state.text }}/> </div>
              </div>
            }
            <p> {this.state.error} </p>
          </div>
          { this.state.found &&
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

              </tbody>
            </table>
          }
        </div>
      </div>
    );
  }
}

export default App;
