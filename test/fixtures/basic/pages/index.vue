<template>
  <div class="container mx-auto py-10">
    <h1 data-testid="title" class="text-3xl">
      Hello World
    </h1>
    <img data-testid="smallImg" :src="require('../image/small.svg')" alt="small svg">
    <img
      data-testid="bigImg"
      :src="require('../image/big.jpg')"
      alt="big jpg"
      height="200"
      width="300"
      class="max-w-300px "
    >
    <ClassComponent />
  </div>
</template>
