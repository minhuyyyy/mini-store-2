import React from 'react'
import { FilmsList } from './shared/FilmsList'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Films() {
  const [film, setFilm] = useState([])
  return (
    <div className='container'>
      {FilmsList.map((film) => (
        <div className='column'>
          <div className='card'>
            <img src={film.img} />
            <h3 key={film.id}>{film.title}</h3>y
            <p className='year'>{film.year}</p>
            <p className='nation'>{film.nation}</p>
            <Link to={`detail/${film.id}`}>
              <p><button>Detail</button></p>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )

}
