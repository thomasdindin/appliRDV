<script setup>
import AdminOpeningDays from "@/views/AdminOpeningDays.vue";
import BookingYeah   from "@/views/BookingYeah.vue";
</script>

<template>
  <Tabs value="0">
    <TabList>
      <Tab value="0" as="div" class="flex items-center gap-2">

        <i class="pi pi-calendar-clock"></i>
        Réservations
      </Tab>
      <Tab value="1" as="div" class="flex items-center gap-2">
        <i class="pi pi-spin pi-cog" style="font-size: 2rem"></i>
        Gérer
      </Tab>
    </TabList>

    <TabPanels>
      <TabPanel value="0">
        <BookingYeah />
      </TabPanel>
      <TabPanel value="1">
        <AdminOpeningDays />
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>