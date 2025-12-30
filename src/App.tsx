import './App.css'

import { useEffect, useState } from "react"
import Book3DViewer from './features/BookViewer';

function App() {
  const [collectionName, setCollectionName] = useState<string>("新書")
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const bookCollections = [
    {
      name: "新書",
      books: [
        '9784004318552',
        '9784121027436',
        '9784004310457',
        '9784004315353',
        '9784004318378',
        '9784121026279',
        '9784004318729',
        '9784004318903',
        '9784121026866',
        '9784004319115',
        '9784121027153',
        '9784004319320',
        '9784004319542',
        '9784121027924',
        '9784004319764',
        '9784121028211',
        '9784004319986',
      ]
    },
    {
      name: "選書",
      books: [
        "9784309413181",
        "9784065184479",
        "9784041060575",
        "9784120057090",
        "9784101092058",
        "9784098607785",
        "9784488420147",
        "9784041092453",
        "9784103522348",
        "9784163915098",
        "9784575590043",
        "9784813716112",
        "9784091237545",
        "9784048926669",
        "9784043878017",
        "9784101098104",
        "9784150119553",
        "9784062769211",
        "9784062153065",
        "9784101001579",
        "9784102018040",
        "9784101005010",
        "9784097263722",
        "9784591097663",
        "9784265062591",
        "9784774611600",
        "9784772100311",
        "9784838729470",
        "9784041055069",
        "9784102122044",
        "9784101269313",
        "9784041067505",
        "9784864726115",
        "9784591160022",
        "9784864106269",
        "9784575522099",
        "9784061473928",
        "9784062120630",
        "9784044292010",
        "9784061484467",
        "9784061485136",
        "9784591113073",
        "9784494004676",
        "9784046313430",
        "9784566024113",
        "9784001145014",
        "9784797329834",
        "9784065122105",
        "9784048737432",
        "9784094071993",
        "9784620108193",
        "9784103549512",
        "9784591153093",
        "9784041160084",
        "9784041026229",
        "9784333019120",
        "9784434108716",
        "9784799322703",
        "9781368022286",
        "9784562056286",
        "9784152092854"
      ]
    }
  ]

  useEffect(() => {
    const books = bookCollections.find(c => c.name === collectionName)?.books ?? [];
    setSelectedBooks(books)
  }, [collectionName])

  return (
    <div style={{ position: "fixed", width: '100vw', height: '100vh' }}>
      <h1 style={{
        position: "absolute",
        top: "2rem",
        left: "2rem",
        zIndex: 100,
        fontSize: "1.25rem", lineHeight: 1, margin: 0,
        display: 'flex',
        gap: "0.5rem",
        alignItems: "end"
      }}>
        <p style={{
          color: "#f5b111",
          margin: 0,
        }}>
          3D Book Collections
        </p>
        <a
          href="https://opencover.jp/"
          target='_blank'
          style={{ textDecoration: "none", color: "inherit", fontSize: "1rem" }}>by opencover</a>
      </h1>
      <select
        name="collection-names"
        id="collection-name"
        onChange={
          (e) => setCollectionName(e.target.value)
        }
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "2rem",
          zIndex: 100,
          padding: "0.5rem 1rem",
          fontWeight: "bold",
          fontSize: "1rem",
          borderRadius: "9999px",
          width: "fit-content",
          height: "fit-content",
          color: "#f5b111",
          border: "none",
          backgroundColor: "#ffffffc0",
          backdropFilter: "blur(10px)"
        }}
      >
        {bookCollections.map((collection, index) => (
          <option
            key={index}
            value={collection.name}
          >
            {collection.name}
          </option>
        ))}
      </select>
      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          right: "2rem",
          zIndex: 100,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          lineHeight: 1,
          padding: "1rem",
          backgroundColor: "#ffffff70",
          backdropFilter: "blur(10px)",
          borderRadius: "1rem"
        }}
      >
        <h2
          style={{
            fontSize: "0.75rem",
            fontWeight: "bold",
            margin: 0
          }}
        >
          このページについて
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: "0.9rem",
          }}
        >
          <a
            style={{ marginRight: "0.25rem", fontWeight: "bold", color: "inherit" }}
            href="https://opencover.jp/"
            target='_blank'
          >
            opencover
          </a>
          による〜
        </p>
      </div>
      <Book3DViewer books={selectedBooks} />
    </div>
  );
}

export default App
