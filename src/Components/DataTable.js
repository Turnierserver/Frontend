import React, { PureComponent } from 'react'
import { Table } from 'semantic-ui-react'

export class DataTable extends PureComponent {
  table (headers, data, renderData) {
    return (
      <Table {...this.props}>
        <Table.Header>
          <Table.Row>
            {headers.map((key) =>
              <Table.HeaderCell key={key.text}>
                {key.text}
              </Table.HeaderCell>
            )}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map(renderData)}
        </Table.Body>
      </Table>
    )
  }
}
