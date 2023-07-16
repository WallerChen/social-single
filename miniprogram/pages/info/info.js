import { classMap, classItemList } from '../../constant/classInfo';
import { getClassmateList } from '../../api/request';
import { deepClone } from '../../utils/util';

let startX = 0;
let endX = 0;
let shouldMove = true;

const admins = [
  'o6orS5emZUHW5BGNYAGO2SP2P7hg',
  'o6orS5aPPXUXSFePhdLTy_Ygn-A8',
  'o6orS5ZvU2Us8IMFLPkO_WHV8_Io',
  'o6orS5UyuvCbL7HCHE8c8gk-WjoM',
];

Page({
  data: {
    page: 1,
    classname: '',
    classItemList,
    classMap,
    isShowInvite: false,
    isShowModal: false,
    prevList: [],
    nextList: [],
    currentPage: 0,
    pageIndex: 0,
    pageSize: 10,
    adminClass: null,
    studentList: [],
  },
  onLoad() {
    this.onGetClassmateList(this.data.page);
    const isRegister = wx.getStorageSync('isRegister');
    const classname = wx.getStorageSync('classname');
    if (isRegister) {
      this.setData({ classname });
    }
    else {
      this.setData({ isShowInvite: true });
    }
  },
  async onGetClassmateList(page) {
    try {
      const classmateList = await getClassmateList({ page });
      this.setData({ page: page + 1 });
      const studentList = this.data.studentList ?? [];
      const cardData = classmateList?.data?.data?.list;
      const total = classmateList?.data?.data?.total;
      const clonedCardData = deepClone(cardData);
      for (const item of clonedCardData) {
        studentList.push(item)
      }
      const finalPage = total / this.data.pageSize;
      const finalShowPage = (this.data.pageIndex + 1 > finalPage) ? 0 : this.data.pageIndex + 1;
      this.setData({
        studentList,
        pageIndex: finalShowPage,
        total,
      });
    }
    catch (e) {
      console.error(e);
    }
  },
  hideInvite() {
    this.setData({ isShowInvite: false });
  },
  onShowVisible() {
    const app = getApp();
    for (const index in this.data.classItemList) {
      if (admins.includes(app.globalData.user?.openid)) {
        this.setData({
          [`classItemList[${index}].isShow`]: true,
          [`classItemList[${index}].isLock`]: false,
        });
      }
      else {
        this.setData({
          [`classItemList[${index}].isShow`]: this.data.classItemList[index].title === app.globalData.user?.class,
          [`classItemList[${index}].isLock`]: !(this.data.classItemList[index].title === app.globalData.user?.class),
        });
      }
    }
    this.setData({
      visible: !app.globalData.user?.class,
      scrollToView: classMap[app.globalData.user?.class] ?? '',
    }, () => !this.data.visible && this.onGetClassmateList());
  },
  getClassCard(e) {
    const app = getApp();
    if (!admins.includes(app.globalData.user?.openid)) return;
    this.setData({
      adminClass: e.currentTarget.dataset.class,
      currentPage: 0,
      pageIndex: 0,
      pageSize: 10,
      prevList: [],
      nextList: [],
      total: 0,
      studentList: [],
    }, () => this.onGetClassmateList());
  },
  openModal() {
    this.setData({ isShowModal: true });
  },
  closeModal() {
    this.setData({ isShowModal: false });
  },
  // 翻页效果
  touchStart(e) {
    startX = e.touches[0].pageX;
    shouldMove = true;
  },
  touchMove(e) {
    if (!shouldMove) return;

    endX = e.touches[0].pageX;
    if (startX - endX > 50) {
      this.next();
      shouldMove = false
    }
    else if (endX - startX > 50) {
      this.prev();
      shouldMove = false;
    }
  },
  prev() {
    if (this.data.currentPage > 0) {
      const currentPage = this.data.currentPage - 1
      this.setData({
        ['nextList[' + currentPage + ']']: '',
        ['prevList[' + currentPage + ']']: 'prevAnimation',
        currentPage,
      });
    }
  },
  next() {
    const { page, currentPage, pageSize, total } = this.data;
    // 数据全部已拉取
    if (((page - 1) * pageSize + currentPage + 1) === total) {
    }
    // 翻到末尾重新拉取新数据
    else if ((currentPage + 1) === pageSize * (page - 1)) {
      this.onGetClassmateList(this.data.page);
    }
    if (currentPage < total) {
      this.setData({
        ['prevList[' + currentPage + ']']: '',
        ['nextList[' + currentPage + ']']: 'nextAnimation',
        currentPage: currentPage + 1
      });
    }
  }
});
