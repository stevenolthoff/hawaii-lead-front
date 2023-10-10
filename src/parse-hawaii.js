// const AX_COPY_GSHEET = 'https://docs.google.com/spreadsheets/d/1ThB2nRoiAYRPqMCXVfMomq7GGoWg_OmyH5xjcQgNEz4/pub?gid=1117954625&single=true&output=tsv'
// const AX_COPY_GSHEET = 'https://docs.google.com/spreadsheets/u/0/d/1ThB2nRoiAYRPqMCXVfMomq7GGoWg_OmyH5xjcQgNEz4/export?format=tsv&id=1ThB2nRoiAYRPqMCXVfMomq7GGoWg_OmyH5xjcQgNEz4&gid=1117954625'
const AX_COPY_GSHEET = 'https://docs.google.com/spreadsheets/d/1iVP9fjFfulsDM6sKvDjewZiGI8Ns6jrkA3FQG39wcFo/export?format=tsv&id=1iVP9fjFfulsDM6sKvDjewZiGI8Ns6jrkA3FQG39wcFo&gid=1117954625'

function parseCell(val,key){
  if(val === ''){
    return null
  }else if(key === 'photo_url'){
    return `https://files.axds.co/portals/hawaii_wiin/fixture_photos/${val}`
  }
  if(key.match(/date/i)){
    return new Date(val)
  }
  return val
}

async function getData(){
  const text = await(await fetch(AX_COPY_GSHEET)).text()
  //   console.log(text)
  const rows = text.split('\r\n')
  const header = rows[0].split('\t')
  const columns = header.map((h,i)=>{
    return {
      key: h.toLowerCase().trim().replace(/\s+/g,'_').replace(/\)|\(/g,''),
      label: h,
      index: i
    }
  })
  const data = rows.slice(1).map(r=>{
    const o = {}
    const row = r.split('\t')
    columns.forEach(c=>{
      if (row[0] === 'Ahuimanu Elementary') {
        // console.log(parseCell(row[c.index],c.key))
      }
      o[c.key] = parseCell(row[c.index],c.key)
      if (row[0] === 'Ahuimanu Elementary') {
        console.log(o)
      }
    })
    return o
  })
  data.columns = columns
  return data
    
    
}


function parseData(data){
  const bySchool = {}
  data.forEach(row=>{
    bySchool[row.school] = bySchool[row.school] || []
    bySchool[row.school].push(row)
  })
  return {
    bySchool,
    data
  }
}

const fs = require('fs')

getData().then(data => {
  const parsed = parseData(data)
  fs.writeFile('data.json', JSON.stringify(parsed, null, 4), { flag: 'a+' }, err => {
    if (err) {
      console.error(err)
    }
  })
}).catch(error => {
  console.error(error)
})
