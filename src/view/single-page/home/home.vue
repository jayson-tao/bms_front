<template>
  <card>
  <div>
    <Row :gutter="20">
      <i-col :xs="12" :md="8" :lg="6" v-for="(infor, i) in inforCardData" :key="`infor-${i}`"
             style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="30" style="margin-top: 10px;">
      <!--<i-col :md="24" :lg="8" style="margin-bottom: 20px;">-->
        <!--<Card shadow>-->
          <!--<chart-pie style="height: 300px;" :value="pieData" text="图书借阅量前5"></chart-pie>-->
        <!--</Card>-->
      <!--</i-col>-->
      <div id="chart" style="width: 100%;height: 450px">
      </div>
    </Row>
  </div>
  </card>
</template>

<script>
  import InforCard from '_c/info-card'
  import CountTo from '_c/count-to'
  import {ChartPie, ChartBar} from '_c/charts'
  import Example from './example.vue'
  import axios from "../../../libs/api.request";
  import echarts from 'echarts';

  export default {
    name: 'home',
    components: {
      InforCard,
      CountTo,
      ChartPie,
      ChartBar,
      Example
    },
    data() {
      return {
        inforCardData: [
          {title: '系统用户量', icon: 'md-person-add', count: 0, color: '#2d8cf0'},
          {title: '累计访问量', icon: 'md-locate', count: 0, color: '#19be6b'},
          { title: '图书种类', icon: 'md-browsers', count: 0, color: '#ff9900' },
          { title: '馆藏数量', icon: 'ios-bookmark', count: 0, color: '#ed3f14' },
        ],
        pieData: [],
        vo:{
          name:"",
          value:0
        }
      }
    },
    methods: {
      //获取数据
      init() {
          axios.request({
            url:'/system',
            method:'get'
          }).then(resp=>{
            this.inforCardData[0].count =resp.data.user
            this.inforCardData[1].count =resp.data.system
            this.inforCardData[2].count =resp.data.bookType
            this.inforCardData[3].count =resp.data.book
          })
      },
      //图书推荐
      bookCount(){
        axios.request({
          url:'/bookBorrowCount',
          method:'get'
        }).then(resp=>{
          var myChart = echarts.init(document.getElementById('chart'));
            myChart.setOption({
              title: {
                text: '最受欢迎的图书',
                x: 'center'
              },
              tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
              },
              legend: {
                orient: 'vertical',
                left: 'left',
                data:resp.data.name
              },
              series: [
                {
                  name: '借阅量',
                  type: 'pie',
                  radius: '55%',
                  center: ['50%', '60%'],
                  data:resp.data.list,
                  itemStyle: {
                    emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  }
                }
              ]
            });
          });
      }
    },
    mounted() {
      this.init()
      this.bookCount()
    }
  }
</script>

<style lang="less">
  .count-style {
    font-size: 50px;
  }
</style>
