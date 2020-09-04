<template>
  <div class="wrap">
    <nav id="w1" class="navbar-inverse navbar-fixed-top navbar">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#w1-collapse"><span
              class="sr-only">Свернуть навигацию</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span></button>
          <a class="navbar-brand" href="/">BestStocks News</a></div>
        <div id="w1-collapse" class="collapse navbar-collapse">
          <ul id="w2" class="navbar-nav navbar-right nav">
            <li class="active">
              <router-link :to="{name: 'MainIndex'}"> Главная</router-link>
            </li>

            <li><a href="https://beststocks-api.sadykh.ru/site/login">Войти</a></li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>
