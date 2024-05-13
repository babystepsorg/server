import React, { Fragment, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { useStepNav } from 'payload/dist/admin/components/elements/StepNav'
import { type AdminViewComponent } from 'payload/dist/config/types'

const InfoComponent: AdminViewComponent = () => {
  const { setStepNav, stepNav } = useStepNav()
  const location = useLocation()

  const [data, setData] = useState<any>({})

  // This effect will only run one time and will allow us
  // to set the step nav to display our custom route name

  useEffect(() => {
    setStepNav([
      ...stepNav,
      {
        label: 'Info',
      },
    ])
  }, [setStepNav])

  useEffect(() => {
    (async () => {
        const paths = location.pathname.split("/")
        paths.pop()
        const id = paths.pop()
    
        const res = await fetch(`/week-info/${id}`);
        const json = await res.json()

        console.log("DATA:: ", json)
        setData(json)
    })()
  }, [location])

  return (
    <Fragment>
      <div
        style={{
          marginTop: 'calc(var(--base) * 2)',
          paddingLeft: 'var(--gutter-h)',
          paddingRight: 'var(--gutter-h)',
        }}
      >
        <h1 id="custom-view-title">Info</h1>
        <h2>Symptoms</h2>
        <ul>
          {data?.symptoms?.docs?.map((doc: any) => {
          <li>
            {doc.name}
          </li>
          })}
        </ul>
        <div style={{ marginTop: '1rem' }}>
          <h2>Content</h2>
        <ul>
          {data?.content?.docs?.map((doc: any) => {
          <li>
            {doc.title}
          </li>
          })}
        </ul>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <h2>Products</h2>
        <ul>
          {data?.content?.products?.map((doc: any) => {
          <li>
            {doc.name}
          </li>
          })}
        </ul>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <h2>Todos</h2>
        <ul>
          {data?.todos?.docs?.map((doc: any) => {
          <li>
            {doc.title}
          </li>
          })}
        </ul>
        </div>
      </div>
    </Fragment>
  )
}

export default InfoComponent