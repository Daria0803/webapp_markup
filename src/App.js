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

class App extends Component {

  state = {
    found: false,
    text: "",
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

      const total = entities.map((obj) => {
        const markupColor = prepareColor(obj.MedEntityType);
        obj.spans.forEach(span => {
          const substr = reviewExample.text.substring(span.begin, span.end);
          if (text) {
            const dataArr = splitOnce(text, substr);
            totalArr.push(dataArr[0] + `<span class="text_${markupColor}">`+substr+'</span>');
            text = dataArr[1];
          }

          //console.log(text);
        });
      });
      //console.log(totalArr.join(''));
      const result = totalArr.join('');

      this.setState({
        found: true,
        text: result,
        error: undefined
      });

    } else {
      this.setState({
        found: false,
        text: "",
        error: "Введите текст отзыва"
      });
    }
  }

  render() {
    return(
      <div>
        <Form TransformText={this.gettingData}/>
        <div>
          { this.state.found &&
            <div>
              <div> <div dangerouslySetInnerHTML={{ __html: this.state.text }}/> </div>
            </div>
          }
          <p> {this.state.error} </p>
        </div>
      </div>
    );
  }
}

export default App;
