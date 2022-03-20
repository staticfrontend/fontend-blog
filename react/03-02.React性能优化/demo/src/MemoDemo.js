import React, { useState, useEffect, memo } from 'react'

function compare(prevProps, nextProps) {
  if (
    prevProps.person.name !== nextProps.person.name || 
    prevProps.person.age !== nextProps.person.age
  ) {
    return false // false 重新渲染，和shouldComponentUpdate相反
  }
  return true
}

const ShowPerson = memo(function ({ person }) {
  console.log('momo render');
  return (
    <div>
      {person.name} {person.age}
    </div>
  )
}, compare)

function Demo() {
  const [person, setPerson] = useState({ name: 'memo', age: 20, job: 'waiter' })

  useEffect(() => {
    setInterval(() => {
      // setPerson 返回一个新的对象内存地址
      setPerson({ ...person, job: 'chef' })
    }, 1000);
  }, [])

  return (
    <div>
      <ShowPerson person={person} />
    </div>
  )
}

export default Demo