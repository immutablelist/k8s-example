import React, { Component } from 'react';
import axios from 'axios';

class Fib extends Component {
  
  state = {
    seenIndexes: [],
    values: {},
    index: '',
    render: 0
  };

  componentDidMount() {
    this.fetchValues();
    this.fetchIndexes();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.render !== this.state.render) {
      this.fetchValues();
      this.fetchIndexes();
    }
  }

  async fetchValues() {
    const values = await axios.get('/api/values/current');
    this.setState({ values: values.data });
  }

  async fetchIndexes() {
    const seenIndexes = await axios.get('/api/values/all');
    this.setState({
      seenIndexes: seenIndexes.data || []
    });
  }

  handleSubmit = async event => {
    event.preventDefault();

    await axios.post('/api/values', {
      index: this.state.index
    });
    
    this.setState({ index: '' }, () => {
      setTimeout(() => {
        this.setState({ render: this.state.render + 1})
      }, 2000);
    });
  };

  renderSeenIndexes() {
    if (Array.isArray(this.state.seenIndexes) && this.state.seenIndexes.length) {
      return this.state.seenIndexes.map(({ number }) => number).join(', ');
    }

    return null;
  }

  renderValues() {
    const entries = [];

    for (let key in this.state.values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {this.state.values[key]}
        </div>
      );
    }

    return entries;
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Enter your index:</label>
          <input
            value={this.state.index}
            onChange={event => this.setState({ index: event.target.value })}
          />
          <button>Submit</button>
        </form>

        <h3>Indexes I have seen:</h3>
        {this.renderSeenIndexes()}

        <h3>Calculated Values:</h3>
        {this.renderValues()}
      </div>
    );
  }
}

export default Fib;