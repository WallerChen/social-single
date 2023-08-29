export const classItemList = [
  { title: '脱单一班', isVip: true, isLock: true, value: 'one' },
  { title: '脱单二班', isVip: false, isLock: true, value: 'two' },
  { title: '脱单三班', isVip: false, isLock: true, value: 'three' },
  { title: '脱单四班', isVip: true, isLock: true, value: 'four' },
  { title: '脱单五班', isVip: true, isLock: true, value: 'five' },
];

export function getClassNameById(classId) {
  const classItem = classItemList.find(({ value }) => value === classId);
  return classItem?.title;
}

export function getClassIdByName(className) {
  const classItem = classItemList.find(({ title }) => title === className);
  return classItem?.value;
}