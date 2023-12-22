


class Node {
  constructor(value){
      this.value = value
      this.next = null
  }
}

class LinkedList {
  constructor(value) {
      const newNode = new Node(value)
      this.head = newNode
      this.tail = this.head
  }

  push(value) {
      const newNode = new Node(value)
      if (!this.head) {
          this.head = newNode
          this.tail = newNode
      } else {
          this.tail.next = newNode
          this.tail = newNode
      }
      return this
  }
}

let list1 = new LinkedList(1)
list1.push(2)
list1.push(5)
list1.push(7)

let list2 = new LinkedList(3)
list2.push(4)

let merge = (l1, l2)=>{
  let newNode = null;
  let temp = null
  if(l1.value <= l2.value){
    newNode = l1
    temp = newNode
    l1= temp.next
  }else{
    newNode = l2
    temp = newNode
    l2= temp.next
  }

  while(l1 && l2){
    if(l1.value <= l2.value){
      temp.next = l1
      temp = l1
      l1 = temp.next

    }else{
      temp.next = l2
      temp = l2
      l2= temp.next
    }
  }
  if(!l2) temp.next = l1
  if(!l1) temp.next = l2
  return newNode
}

console.log(merge(list1.head, list2.head))