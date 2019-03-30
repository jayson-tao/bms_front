<template>
  <div class="animated fadeIn">
    <Card>
      <Row>
        模块：<Input v-model="keyWord" placeholder="请输入..." style="width:200px"/>
        <Button type="primary" shape="circle" icon="ios-search" @click="gopage(1)" style="margin-left: 10px">搜索</Button>
      </Row>
      <br>
      <Row>
        <Button type="primary" icon="plus-round" @click="addModule()">新建</Button>
        <Button type="success" icon="wrench" @click="edit()">修改</Button>
        <Button type="error" icon="trash-a" @click="remove()">删除</Button>
      </Row>
      <br>
      <Row>
        <Table border :columns="columns1" :data="data1" @on-selection-change="change"></Table>
      </Row>
      <br>
      <Row>
        <Page :total="totalCount" :page-size="pageSize" :current="pageNo" @on-change="gopage"
              align="center"></Page>
      </Row>
      <br>
    </Card>
  </div>
</template>
