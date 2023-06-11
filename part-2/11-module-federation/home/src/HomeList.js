const HomeList = (num) => {
  let str = "<ul>";
  for (let i = 0; i < num; i++) {
    str += `<li>第${i + 1}个元素</li>`;
  }
  str += "</ul>";
  return str;
};

export default HomeList;
