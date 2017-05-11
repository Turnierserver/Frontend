import React, { Component } from 'react'
import { Table } from 'semantic-ui-react'

export class DataTable extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sorting: {
        _current: null
      }
    }
    this.table = this.table.bind(this)
  }

  handleSort (key, event) {
    event.preventDefault()
    let id = key.text
    let prev = this.state.sorting[id] === undefined
      ? key.sortable !== 'descending'
      : this.state.sorting[id]
    let sorting = Object.assign(this.state.sorting, {
      _current: id,
      [id]: !prev
    })
    this.setState({ sorting })
  }

  table (headers, data, renderData) {
    let sorting = this.state.sorting
    return (
      <Table singleLine sortable>
        <Table.Header>
          <Table.Row>
            {headers.map((key) =>
              <Table.HeaderCell key={key.text} sorted={
                sorting._current === key.text
                ? (sorting[key.text] ? 'ascending' : 'descending')
                : null
              } onClick={(e) => this.handleSort(key, e)}>
                {key.text}
              </Table.HeaderCell>
            )}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map(renderData.bind(this))}
        </Table.Body>
      </Table>
    )
  }
}
