import { useState, useEffect } from "react";

import {ulid} from "ulid";

import * as todoData from "../apis/todos";

//カスタムフックを作成
export const useTodo = () => {
    const [todoList, setTodoList] = useState([]);

    useEffect(() => {
        todoData.getAllTodosData().then((todo) => {
            setTodoList([...todo].reverse());//逆順にすることで追加順に上から表示させられる
        });
    }, []);

    //doneの真偽値反転させ更新
    const toggleTodoListItemStatus = (id, done) => {
        const todoItem = todoList.find((item) => item.id === id);
        const newTodoItem = { ...todoItem, done: !done};
        todoData.updateTodoData(id, newTodoItem).then((updateTodo) => {
            //idが同じ場合，updateTodoを
            //異なる場合，元のListのitemを返す
            const newTodoList = todoList.map((item) =>
                item.id !== updateTodo.id ? item : updateTodo
            );
            setTodoList(newTodoList);
        });
    };

    const addTodoListItem = (todoContent) => {
        const newTodoItem = {
            content: todoContent,
            id: ulid(),
            done: false
        };

        return todoData.addTodoData(newTodoItem).then((addTodo) => {
            setTodoList([addTodo, ...todoList]);
        });
    };

    const deleteTodoListItem =(id) => {
        //idが一致したTodoを除外
        todoData.deleteTodoData(id).then((deleteTodoListItemId) => {
            const newTodoList = todoList.filter(
                (item) => item.id !== deleteTodoListItemId
            );
            setTodoList(newTodoList);
        });
    };

    return {
        todoList,
        toggleTodoListItemStatus,
        addTodoListItem,
        deleteTodoListItem
    };
};