const fileInput = document.querySelector(".input-txt");
const output = document.querySelector(".txt-child");
const tableDiv = document.querySelector(`.table-div`);

let txt;

fileInput.addEventListener("change", () => {
  // setTimeout(
  //   fetch("http://127.0.0.1:3000/empty", {
  //     method: "delete",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //     },
  //   }),
  //   1
  // );

  tableDiv.innerHTML = " ";
  tableDiv.innerHTML = `
    <table class="table">
              <thead>
                <tr class="tr">
                  <th>Type</th>
                  <th>Direct</th>
                  <th>Color</th>
                  <th>Lamp</th>
                  <th>Line</th>
                  <th>Power[W]</th>
                  <th>REF1</th>
                  <th>obj</th>
                  <th>date</th>
                </tr>
              </thead>
              <tbody class="tBody"></tbody>
  `;
  const tableBody = document.querySelector(`.tBody`);

  const [file] = fileInput.files;
  if (file) {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      //   console.log(`${reader.result}\n${file.name}`);

      const startTxt = reader.result.indexOf(`:D`);
      const endTxt = reader.result.indexOf(`:END`);
      let resultTxt = reader.result
        .slice(startTxt, endTxt)
        .replaceAll(`:D`, ``)
        .trimEnd()
        .split(`\n`);

      let arr = [];

      resultTxt.forEach((e) => {
        let arrX = [];
        arrX = e.split(`;`).slice(3);
        arrX.splice(1, 4);
        arrX.splice(2, 1);
        arrX.splice(3, 1);
        arrX.push(`x`, `y`);
        arr.push(arrX);
      });

      resultTxt = arr.join(`\n`);

      let [fileNameIp, fileNameDate] = file.name.slice(0, -4).split(`_`);
      fileNameDate = fileNameDate.replaceAll(`.`, `-`);

      // resultTxt = resultTxt.replaceAll(`x`, fileNameIp);
      // resultTxt = resultTxt.replaceAll(`y`, fileNameDate);

      // const regex = /(V|GP)([0-9]+)([A-Z])([0-9]+)(L|\b)/g;
      const regex =
        /(V|GP)([0-9]+)([A-Z])([0-9]+)(L|\b),([0-9]+),([0-9]+),(x),(y)/g;

      let m;
      let arrm = [];
      let txt = ``;

      while ((m = regex.exec(resultTxt)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }

        m = m.slice(1);
        m.splice(7, 1, fileNameIp);
        m.splice(8, 1, fileNameDate);
        arrm.push(m);
      }

      resultTxt = arrm.join(`\n`);

      // output.innerText = `${resultTxt}`;
      console.log(arrm);

      let obj = {};

      arrm.forEach((e, i) => {
        obj = {
          type: e[0],
          direct: e[1],
          color: e[2],
          lamp: e[3],
          line: e[4],
          power: e[5],
          ref1: e[6],
          obj: e[7],
          date: e[8],
        };
        console.log(obj);
        fetch("http://127.0.0.1:3000/post", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(obj),
        })
          .then((result) => result.json())
          .then((result) => console.log(result))
          .catch((err) => console.error(err));

        const row = tableBody.insertRow(0);
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        const cell5 = row.insertCell(4);
        const cell6 = row.insertCell(5);
        const cell7 = row.insertCell(6);
        const cell8 = row.insertCell(7);
        const cell9 = row.insertCell(8);
        cell1.innerHTML = `${e[0]}`;
        cell2.innerHTML = e[1];
        cell3.innerHTML = e[2];
        cell4.innerHTML = e[3];
        cell5.innerHTML = e[4];
        cell6.innerHTML = e[5];
        cell7.innerHTML = e[6];
        cell8.innerHTML = e[7];
        cell9.innerHTML = e[8];
      });
    });
    reader.readAsText(file);
  }
});
