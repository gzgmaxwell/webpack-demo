fetch("/api/hello")
  .then((res) => res.text())
  .then((res) => {
    console.log(res);
  });
