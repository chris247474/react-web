import React from 'react'
import './App.css'
import Contract from './contract'
import { AppProps, AppState } from './models'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'

const App = class Index extends React.Component<AppProps, AppState> {
  public textInput: any
  private contract: Contract = new Contract()
  private value: number

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
    const loomyAlert = () => {
      return <Alert variant="success">I dare you to enter 47!</Alert>
    }

    return (
      <div className="container" style={{ marginTop: 10 }}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <div className="form-group">
            <label>Enter Value</label>
            <input
              type="number"
              className="form-control"
              onChange={(event) => this.onChangeHandler(event)}
              ref={this.textInput}
            />
            <small className="form-text text-muted">Set a number</small>
          </div>
          <Button
            size="lg"
            type="submit"
            variant="primary"
            onClick={() => this.confirmValue()}
            disabled={!this.state.isValid || this.state.isSending}
            block
          >
            Confirm
          </Button>
        </form>
        <div className="alert alert-success">
          Value set is {this.state.value} (this value only updates if values is
          10 or ...)
        </div>
        {this.state.tries === 3 && loomyAlert()}
        <hr />
        <pre>{this.state.tx && JSON.stringify(this.state.tx, null, 2)}</pre>
      </div>
    )
  }
}

export default App
