import React from 'react'
import './App.css'
import Contract from './contract'
import { AppProps, AppState } from './models'

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

const App = class Index extends React.Component<AppProps, AppState> {
  textInput: any
  contract: Contract = new Contract()
  value: number = 0

  constructor(props: AppProps) {
    super(props)

    this.textInput = React.createRef()
    this.value = 0

    this.state = {
      value: 0,
      isValid: false,
      isSending: false,
      tx: null,
      tries: 0
    }
  }

  async componentWillMount() {
    await this.contract.loadContract()
    this.contract.addEventListener((v: any) => {
      this.setState({ value: v._value })
    })
  }

  onChangeHandler(event: any) {
    this.value = event.target.value
    const isValid = this.value > 0
    this.setState({ isValid })
  }

  async confirmValue() {
    this.setState({ isSending: true })
    try {
      const tx = await this.contract.setValue(this.value)
      const tries = this.state.tries + 1
      this.textInput.current.value = ''
      this.setState({ tx, tries, isValid: false })
    } catch (err) {
      console.error('Ops, some error happen:', err)
    }
    this.setState({ isSending: false })
  }

  render() {
    const loomyAlert = (
      <div className="alert alert-warning">
        I dare you to type 47 and press Confirm !
      </div>
    )

    return (
      <div className="container" style={{ marginTop: 10 }}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <div className="form-group">
            <label>Value</label>
            <input
              type="number"
              className="form-control"
              onChange={(event) => this.onChangeHandler(event)}
              ref={this.textInput}
            />
            <small className="form-text text-muted">Set a number</small>
          </div>
          <button
            type="button"
            disabled={!this.state.isValid || this.state.isSending}
            className="btn btn-primary"
            onClick={() => this.confirmValue()}
          >
            Confirm
          </button>
        </form>
        <div className="alert alert-success">
          Value set is {this.state.value} (this value only updates if values is
          10 or ...)
        </div>
        {this.state.tries === 3 && loomyAlert}
        <hr />
        <pre>{this.state.tx && JSON.stringify(this.state.tx, null, 2)}</pre>
      </div>
    )
  }
}

export default App
