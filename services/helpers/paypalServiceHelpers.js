const createSubscribersDataStructure = (subscriptions) => {
  const subscribers = [];

  for (const subscription of subscriptions) {
    let index = subscribers.findIndex((sub) => sub.id === subscription.plan_id);

    const subscriptorData = {
      id: subscription.id,
      name: `${subscription.subscriber.name.given_name} ${subscription.subscriber.name.surname}`,
      email: subscription.subscriber.email_address,
      status: subscription.status,
      create_time: subscription.create_time,
      update_time: subscription.update_time,
    };

    if (index === -1) {
      subscribers.push({
        id: subscription.plan_id,
        subscriptors: [subscriptorData],
      });
    } else {
      subscribers[index].subscriptors.push(subscriptorData);
    }
  }
  return subscribers;
};

module.exports = {
  createSubscribersDataStructure,
};
