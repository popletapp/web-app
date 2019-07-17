import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Home, Board, Landing } from './../../../pages'

export default function App () {
  return (
    <Switch>
      <Route exact path='/' component={Landing} />
      <Route exact path='/home' component={Home} />
      <Route path='/boards/:id' component={Board} />
    </Switch>
  )
}