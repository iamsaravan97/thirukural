import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-poc-tree-filter',
  templateUrl: './poc-tree-filter.component.html',
  styleUrls: ['./poc-tree-filter.component.css']
})
export class PocTreeFilterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  nodes = [
    {
      id: 1,
      name: 'root1',
      children: [
        { id: 2, name: 'child1' },
        { id: 3, name: 'child2' }
      ]
    },
    {
      id: 4,
      name: 'root2',
      children: [
        { id: 5, name: 'child2.1' },
        {
          id: 6,
          name: 'child2.2',
          children: [
            { id: 7, name: 'subsub' }
          ]
        }
      ]
    }
  ];
  options = {};

}
