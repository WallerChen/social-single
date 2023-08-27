export const classItemList = [
  { title: '脱单一班', isVip: true, isLock: true, value: 'one' },
  { title: '脱单二班', isVip: false, isLock: true, value: 'two' },
  { title: '脱单三班', isVip: false, isLock: true, value: 'three' },
  { title: '脱单四班', isVip: true, isLock: true, value: 'four' },
  { title: '脱单五班', isVip: true, isLock: true, value: 'five' },
];

export const classMap = () => {
  const result = {};
  Array.isArray(classItemList) && classItemList.forEach(({ title, value }) => result[title] = value);
  return result;
};
