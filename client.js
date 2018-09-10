function submit()
{
  console.log("Clicked")
  url = "http://127.0.0.1:3000/submit?" + "city=" +document.getElementById("city").value
  console.log(url)
  axios.post(url).then(response => console.log(response.data));
}

function test()
{
  console.log("works")
}
