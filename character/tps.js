'use strict';
game.import('character',
	function (lib, game, ui, get, ai, _status) {
	var result={
		name: 'tps',
		skill: {
			shensi: {
				audio: "luoshen",
				alter: true,
				trigger: {
					player: "phaseBegin",
				},
				frequent: true,
				content: function () {
					"step 0"
					if (event.cards == undefined)
						event.cards = [];
					player.judge(function (card) {
						if (get.color(card) == 'black')
							return 1.5;
						return -1.5;
					}, ui.special);
					"step 1"
					if (result.judge > 0) {
						event.cards.push(result.card);
						if (lib.config.autoskilllist.contains('shensi')) {
							player.chooseBool('是否再次发动【神思】？');
						} else {
							event._result = {
								bool: true
							};
						}
					} else {
						for (var i = 0; i < event.cards.length; i++) {
							if (get.position(event.cards[i]) != 's') {
								event.cards.splice(i, 1);
								i--;
							}
						}
						player.gain(event.cards, 'gain2');
						player.storage.shensi = event.cards.slice(0);
						event.finish();
					}
					"step 2"
					if (result.bool) {
						event.goto(0);
					} else {
						if (event.cards.length) {
							player.gain(event.cards, 'gain2');
							player.storage.shensi = event.cards.slice(0);
						}
					}
				},
				mod: {
					ignoredHandcard: function (card, player) {
						if (get.is.altered('shensi') && player.storage.shensi && player.storage.shensi.contains(card)) {
							return true;
						}
					},
				},
				group: "shensi_clear",
				subSkill: {
					clear: {
						trigger: {
							player: "phaseAfter",
						},
						silent: true,
						content: function () {
							delete player.storage.shensi;
						},
						sub: true,
						forced: true,
						popup: false,
					},
				},
			},
			tiba: {
				audio: 2,
				enable: ["chooseToRespond"],
				filterCard: function (card) {
					return get.color(card) == 'black';
				},
				viewAs: {
					name: "shan",
					suit: "club",
					number: 2,
				},
				viewAsFilter: function (player) {
					if (!player.countCards('h', {
							color: 'black'
						}))
						return false;
				},
				prompt: "将一张理科手牌当答打出",
				check: function () {
					return 1
				},
				ai: {
					respondShan: true,
					skillTagFilter: function (player) {
						if (!player.countCards('h', {
								color: 'black'
							}))
							return false;
					},
					effect: {
						target: function (card, player, target, current) {
							if (get.tag(card, 'respondShan') && current < 0)
								return 0.6
						},
					},
					basic: {
						useful: [7, 2],
						value: [7, 2],
					},
				},
			},
			liangong: {
				trigger: {
					player: "shaMiss",
				},
				direct: true,
				filter: function (event, player) {
					if (get.mode() == 'guozhan')
						return false;
					return player.canUse('sha', event.target) && player.hasSha();
				},
				content: function () {
					"step 0"
					if (player.hasSkill('jiu')) {
						game.broadcastAll(function (player) {
							player.removeSkill('jiu');
						}, player);
						event.jiu = true;
					}
					player.chooseToUse(get.prompt('liangong'), {
						name: 'sha'
					}, trigger.target, -1).set('addCount', false).logSkill = 'liangong';
					"step 1"
					if (result.bool);
					else if (event.jiu) {
						player.addSkill('jiu');
					}
				},
			},
			tps_bufa: {
				audio: 1,
				filter: function (event, player) {
					return player.countCards('he', {
						suit: 'club'
					}) > 0;
				},
				enable: "chooseToUse",
				filterCard: function (card) {
					return get.suit(card) == 'club';
				},
				position: "he",
				viewAs: {
					name: "shandian",
					suit: "club",
					number: 7,
					cards: [{
							"node": {
								"image": {},
								"info": {},
								"name": {},
								"name2": {},
								"background": {},
								"intro": {},
								"range": {}
							},
							"storage": {},
							"vanishtag": [],
							"_uncheck": [],
							"suit": "club",
							"number": 7,
							"name": "nanman",
							"cardid": "4295341268",
							"clone": {
								"name": "nanman",
								"suit": "club",
								"number": 7,
								"node": {
									"name": {},
									"info": {},
									"intro": {},
									"background": {},
									"image": {}
								},
								"_transitionEnded": true,
								"timeout": 1242
							},
							"original": "j",
							"viewAs": "shandian",
							"_transform": "translateX(0px)",
							"timeout": 1229
						}
					],
				},
				prompt: "将一张科学牌当就寝讲话使用",
				check: function (card) {
					return 6 - get.value(card)
				},
				ai: {
					threaten: 1.5,
					basic: {
						order: 1,
						useful: 1,
						value: 8,
					},
					result: {
						target: function (player, target) {
							var num = target.hp - target.countCards('h') - 2;
							if (num > -1)
								return -0.01;
							if (target.hp < 3)
								num--;
							if (target.isTurnedOver())
								num /= 2;
							var dist = get.distance(player, target, 'absolute');
							if (dist < 1)
								dist = 1;
							return num / Math.sqrt(dist);
						},
					},
					tag: {
						skip: "phaseUse",
					},
				},
			},
			tps_bangtou: {
				group: ["lianhuan3", "lianhuan2", "lianhuan4"],
			},
			tps_siren: {
				audio: 2,
				trigger: {
					player: "dieBefore",
				},
				forced: true,
				filter: function (event, player) {
					return player.maxHp > 0 && player.hp <= 0
				},
				content: function () {
					"step 0"
					event.card = get.cards()[0];
					if (player.storage.tps_siren == undefined)
						player.storage.tps_siren = [];
					player.storage.tps_siren.push(event.card);
					player.syncStorage('tps_siren');
					player.showCards(player.storage.tps_siren, '死人')
					player.markSkill('tps_siren');
					"step 1"
					for (var i = 0; i < player.storage.tps_siren.length - 1; i++) {
						if (get.number(event.card) && get.number(event.card) == get.number(player.storage.tps_siren[i]))
							return;
					}
					trigger.cancel();
					if (player.hp <= 0) {
						player.hp = 1;
						player.update();
					}
				},
				init: function (player) {
						player.storage.tps_siren = [];
				},
				mod: {
					maxHandcard: function (player, num) {
						if (player.storage.tps_siren && player.storage.tps_siren.length)
							return num - player.hp + player.storage.tps_siren.length;
					},
				},
				intro: {
					content: "cards",
					onunmark: function (storage, player) {
						if (storage && storage.length) {
							player.$throw(storage);
							for (var i = 0; i < storage.length; i++) {
								storage[i].discard();
							}
							delete player.storage.tps_siren;
						}
					},
				},
			},
			tps_zilian: {
				audio: 2,
				enable: "chooseToUse",
				filterCard: function (card) {
					return get.color(card) == 'black';
				},
				viewAsFilter: function (player) {
					return player.countCards('h', {
						color: 'black'
					}) > 0;
				},
				viewAs: {
					name: "wuxie",
					suit: "club",
					number: 3,
					cards: [{
							"node": {
								"image": {},
								"info": {},
								"name": {},
								"name2": {},
								"background": {},
								"intro": {},
								"range": {}
							},
							"storage": {},
							"vanishtag": [],
							"_uncheck": [],
							"suit": "club",
							"number": 3,
							"name": "sha",
							"cardid": "4789576256",
							"clone": {
								"name": "sha",
								"suit": "club",
								"number": 3,
								"node": {
									"name": {},
									"info": {},
									"intro": {},
									"background": {},
									"image": {}
								},
								"_transitionEnded": true,
								"timeout": 223
							},
							"timeout": 184,
							"original": "h"
						}
					],
				},
				prompt: "将一张理科手牌当我很优秀使用",
				check: function (card) {
					return 8 - get.value(card)
				},
				threaten: 1.2,
				ai: {
					basic: {
						useful: [6, 4],
						value: [6, 4],
					},
					result: {
						player: 1,
					},
					expose: 0.2,
				},
			},
			tps_jinze: {
				forced: true,
				locked: true,
				group: ["wushuang1"],
			},
			tps_gaizi: {
				group: ["longdan_sha", "longdan_shan", "longdan_draw"],
				subSkill: {
					draw: {
						trigger: {
							player: ["useCard", "respond"],
						},
						forced: true,
						popup: false,
						filter: function (event, player) {
							if (!get.zhu(player, 'shouyue'))
								return false;
							return event.skill == 'longdan_sha' || event.skill == 'longdan_shan';
						},
						content: function () {
							player.draw();
							player.storage.fanghun2++;
						},
						sub: true,
					},
					sha: {
						audio: 2,
						enable: ["chooseToUse", "chooseToRespond"],
						filterCard: {
							name: "shan",
						},
						viewAs: {
							name: "sha",
						},
						viewAsFilter: function (player) {
							if (!player.countCards('h', 'shan'))
								return false;
						},
						prompt: "将一张答当问使用或打出",
						check: function () {
							return 1
						},
						ai: {
							effect: {
								target: function (card, player, target, current) {
									if (get.tag(card, 'respondSha') && current < 0)
										return 0.6
								},
							},
							respondSha: true,
							skillTagFilter: function (player) {
								if (!player.countCards('h', 'shan'))
									return false;
							},
							order: function () {
								return get.order({
									name: 'sha'
								}) + 0.1;
							},
							useful: -1,
							value: -1,
							basic: {
								useful: [5, 1],
								value: [5, 1],
							},
							result: {
								target: function (player, target) {
									if (player.hasSkill('jiu') && !target.getEquip('baiyin')) {
										if (get.attitude(player, target) > 0) {
											return -6;
										} else {
											return -3;
										}
									}
									return -1.5;
								},
							},
							tag: {
								respond: 1,
								respondShan: 1,
								damage: function (card) {
									if (card.nature == 'poison')
										return;
									return 1;
								},
								natureDamage: function (card) {
									if (card.nature)
										return 1;
								},
								fireDamage: function (card, nature) {
									if (card.nature == 'fire')
										return 1;
								},
								thunderDamage: function (card, nature) {
									if (card.nature == 'thunder')
										return 1;
								},
								poisonDamage: function (card, nature) {
									if (card.nature == 'poison')
										return 1;
								},
							},
						},
						sub: true,
					},
					shan: {
						audio: 2,
						enable: ["chooseToRespond"],
						filterCard: {
							name: "sha",
						},
						viewAs: {
							name: "shan",
						},
						prompt: "将一张问当答打出",
						check: function () {
							return 1
						},
						viewAsFilter: function (player) {
							if (!player.countCards('h', 'sha'))
								return false;
						},
						ai: {
							respondShan: true,
							skillTagFilter: function (player) {
								if (!player.countCards('h', 'sha'))
									return false;
							},
							effect: {
								target: function (card, player, target, current) {
									if (get.tag(card, 'respondShan') && current < 0)
										return 0.6
								},
							},
							order: 4,
							useful: -1,
							value: -1,
							basic: {
								useful: [7, 2],
								value: [7, 2],
							},
						},
						sub: true,
					},
				},
			},
			tps_gaile: {
				audio: 2,
				trigger: {
					global: "judge",
				},
				direct: true,
				filter: function (event, player) {
					return player.countCards('he') > 0;
				},
				content: function () {
					"step 0"
					player.chooseCard(get.translation(trigger.player) + '的' + (trigger.judgestr || '') + '判定为' +
						get.translation(trigger.player.judging[0]) + '，' + get.prompt('tps_gaile'), 'he').set('ai', function (card) {
						var trigger = _status.event.getTrigger();
						var player = _status.event.player;
						var judging = _status.event.judging;
						var result = trigger.judge(card) - trigger.judge(judging);
						var attitude = get.attitude(player, trigger.player);
						if (attitude == 0 || result == 0)
							return 0;
						if (attitude > 0) {
							return result - get.value(card) / 2;
						} else {
							return -result - get.value(card) / 2;
						}
					}).set('judging', trigger.player.judging[0]);
					"step 1"
					if (result.bool) {
						player.respond(result.cards, 'highlight');
					} else {
						event.finish();
					}
					"step 2"
					if (result.bool) {
						player.logSkill('tps_gaile');
						if (trigger.player.judging[0].clone) {
							trigger.player.judging[0].clone.classList.remove('thrownhighlight');
							game.broadcast(function (card) {
								if (card.clone) {
									card.clone.classList.remove('thrownhighlight');
								}
							}, trigger.player.judging[0]);
							game.addVideo('deletenode', player, get.cardsInfo([trigger.player.judging[0].clone]));
						}
						trigger.player.judging[0].discard();
						trigger.player.judging[0] = result.cards[0];
						if (!get.owner(result.cards[0], 'judge')) {
							trigger.position.appendChild(result.cards[0]);
						}
						game.log(trigger.player, '的判定牌改为', result.cards[0]);
						game.delay(2);
					}
				},
				ai: {
					tag: {
						rejudge: 1,
					},
				},
			},
			tps_wanji: {
				audio: 2,
				enable: "chooseToUse",
				filterCard: function (card) {
					return get.color(card) == 'black';
				},
				viewAsFilter: function (player) {
					return player.countCards('h', {
						color: 'black'
					}) > 0;
				},
				viewAs: {
					name: "wuxie",
					suit: "spade",
					number: 2,
					cards: [{
							"node": {
								"image": {},
								"info": {},
								"name": {},
								"name2": {},
								"background": {},
								"intro": {},
								"range": {}
							},
							"storage": {},
							"vanishtag": [],
							"_uncheck": [],
							"suit": "spade",
							"number": 2,
							"name": "bagua",
							"cardid": "3932937265",
							"clone": {
								"name": "bagua",
								"suit": "spade",
								"number": 2,
								"node": {
									"name": {},
									"info": {},
									"intro": {},
									"background": {},
									"image": {}
								},
								"_transitionEnded": true,
								"timeout": 617
							},
							"timeout": 593,
							"original": "h"
						}
					],
				},
				prompt: "将一张理科手牌当我很优秀使用",
				check: function (card) {
					return 8 - get.value(card)
				},
				threaten: 1.2,
				ai: {
					basic: {
						useful: [6, 4],
						value: [6, 4],
					},
					result: {
						player: 1,
					},
					expose: 0.2,
				},
			},
			tps_zifu: {
				audio: 1,
				filter: function (event, player) {
					return player.countCards('he', {
						suit: 'diamond'
					}) > 0;
				},
				enable: "chooseToUse",
				filterCard: function (card) {
					return get.suit(card) == 'diamond';
				},
				position: "he",
				viewAs: {
					name: "taoyuan",
					suit: "diamond",
					number: 11,
					cards: [{
							"node": {
								"image": {},
								"info": {},
								"name": {},
								"name2": {},
								"background": {},
								"intro": {},
								"range": {}
							},
							"storage": {},
							"vanishtag": [],
							"_uncheck": [],
							"suit": "diamond",
							"number": 11,
							"name": "shan",
							"cardid": "9840757267",
							"clone": {
								"name": "shan",
								"suit": "diamond",
								"number": 11,
								"node": {
									"name": {},
									"info": {},
									"intro": {},
									"background": {},
									"image": {}
								},
								"_transitionEnded": true,
								"timeout": 791
							},
							"timeout": 737,
							"original": "h"
						}
					],
				},
				prompt: "将一张英语牌当反思大会使用",
				check: function (card) {
					return 6 - get.value(card)
				},
				ai: {
					threaten: 1.5,
					basic: {
						order: 1,
						useful: 1,
						value: 8,
					},
					result: {
						target: function (player, target) {
							var num = target.hp - target.countCards('h') - 2;
							if (num > -1)
								return -0.01;
							if (target.hp < 3)
								num--;
							if (target.isTurnedOver())
								num /= 2;
							var dist = get.distance(player, target, 'absolute');
							if (dist < 1)
								dist = 1;
							return num / Math.sqrt(dist);
						},
					},
					tag: {
						skip: "phaseUse",
						recover: 0.5,
						multitarget: 1,
					},
				},
			},
			tps_jiwei: {
				audio: 1,
				enable: "phaseUse",
				discard: false,
				filter: function (event, player) {
					return player.countCards('he', {
						suit: 'diamond'
					}) > 0;
				},
				prepare: "throw",
				position: "he",
				filterCard: {
					suit: "diamond",
				},
				filterTarget: function (card, player, target) {
					if (player == target)
						return false;
					if (target.hasJudge('lebu'))
						return true;
					return lib.filter.targetEnabled({
						name: 'lebu'
					}, player, target);
				},
				check: function (card) {
					return 7 - get.value(card);
				},
				content: function () {
					if (target.hasJudge('lebu')) {
						target.discard(target.getJudge('lebu'));
					} else {
						var next = player.useCard({
								name: 'lebu'
							}, target, cards);
						next.animate = false;
						next.audio = false;
					}
					player.draw();
				},
				ai: {
					result: {
						target: function (player, target) {
							if (target.hasJudge('lebu'))
								return -get.effect(target, {
									name: 'lebu'
								}, player, target);
							return get.effect(target, {
								name: 'lebu'
							}, player, target);
						},
					},
					order: 9,
				},
			},
			tps_jianguan: {
				audio: 1,
				filter: function (event, player) {
					return player.countCards('he', {
						suit: 'diamond'
					}) > 0;
				},
				enable: "chooseToUse",
				filterCard: function (card) {
					return get.suit(card) == 'diamond';
				},
				position: "he",
				viewAs: {
					name: "lebu",
					suit: "diamond",
					number: 6,
					cards: [{
							"node": {
								"image": {},
								"info": {},
								"name": {},
								"name2": {},
								"background": {},
								"intro": {},
								"range": {}
							},
							"storage": {},
							"vanishtag": [],
							"_uncheck": [],
							"suit": "diamond",
							"number": 6,
							"name": "sha",
							"cardid": "9102639275",
							"clone": {
								"name": "sha",
								"suit": "diamond",
								"number": 6,
								"node": {
									"name": {},
									"info": {},
									"intro": {},
									"background": {},
									"image": {}
								},
								"_transitionEnded": true,
								"fixed": true,
								"timeout": 471
							},
							"original": "h",
							"_transform": "translateY(0px)",
							"viewAs": "lebu"
						}
					],
				},
				prompt: "将一张英语牌当罚站使用",
				check: function (card) {
					return 6 - get.value(card)
				},
				ai: {
					threaten: 1.5,
					basic: {
						order: 1,
						useful: 1,
						value: 8,
					},
					result: {
						target: function (player, target) {
							var num = target.hp - target.countCards('h') - 2;
							if (num > -1)
								return -0.01;
							if (target.hp < 3)
								num--;
							if (target.isTurnedOver())
								num /= 2;
							var dist = get.distance(player, target, 'absolute');
							if (dist < 1)
								dist = 1;
							return num / Math.sqrt(dist);
						},
					},
					tag: {
						skip: "phaseUse",
					},
				},
			},
			tps_zuobi: {
				mod: {
					maxHandcard: function (player, num) {
						return num + 2;
					},
				},
				zhuSkill: true,
			},
			tps_zaoli: {
				audio: 4,
				forbid: ["boss"],
				trigger: {
					player: "dieBegin",
				},
				forced: true,
				filter: function (event) {
					return event.source && event.source.isIn();
				},
				content: function () {
					trigger.source.die();
				},
				logTarget: "source",
				ai: {
					threaten: function (player, target) {
						if (target.hp == 1)
							return 0.2;
						return 1.5;
					},
					effect: {
						target: function (card, player, target, current) {
							if (!target.hasFriend())
								return;
							if (target.hp <= 1 && get.tag(card, 'damage'))
								return [1, 0, 0, -2];
						},
					},
				},
			},
			tps_qinxue: {
				audio: 2,
				trigger: {
					player: "phaseDrawBegin",
				},
				frequent: true,
				content: function () {
					trigger.num += 3;
				},
				ai: {
					threaten: 1.3,
				},
			},
			tps_tianwen: {
				mod: {
					suit: function (card, suit) {
						if (suit == 'diamond')
							return 'heart';
					},
				},
			},
			tps_miaobi: {
				audio: 2,
				enable: ["chooseToRespond"],
				filterCard: function (card) {
					return get.color(card) == 'red';
				},
				viewAs: {
					name: "shan",
				},
				viewAsFilter: function (player) {
					if (!player.countCards('h', {
							color: 'red'
						}))
						return false;
				},
				prompt: "将一张文科手牌当答打出",
				check: function () {
					return 1
				},
				ai: {
					respondShan: true,
					skillTagFilter: function (player) {
						if (!player.countCards('h', {
								color: 'red'
							}))
							return false;
					},
					effect: {
						target: function (card, player, target, current) {
							if (get.tag(card, 'respondShan') && current < 0)
								return 0.6
						},
					},
					basic: {
						useful: [7, 2],
						value: [7, 2],
					},
				},
			},
			tps_bili: {
				audio: 2,
				enable: "phaseUse",
				usable: 1,
				filterTarget: function (card, player, target) {
					return player != target && target.countCards('h');
				},
				filter: function (event, player) {
					return player.countCards('h') > 0;
				},
				content: function () {
					"step 0"
					player.chooseToCompare(target).set('small', true);
					"step 1"
					if (result.bool) {
						if (!target.hasSkill('fengyin')) {
							target.addTempSkill('fengyin');
						}
						target.addTempSkill('yijue2');
						event.finish();
					} else if (target.hp < target.maxHp) {
						player.chooseBool('是否让目标回复一点分数？').ai = function (event, player) {
							return get.recoverEffect(target, player, player) > 0;
						};
					} else {
						event.finish();
					}
					"step 2"
					if (result.bool) {
						target.recover();
					}
				},
				ai: {
					result: {
						target: function (player, target) {
							var hs = player.getCards('h');
							if (hs.length < 3)
								return 0;
							var bool = false;
							for (var i = 0; i < hs.length; i++) {
								if (hs[i].number >= 9 && get.value(hs[i]) < 7) {
									bool = true;
									break;
								}
							}
							if (!bool)
								return 0;
							if (target.countCards('h') > target.hp + 1 && get.recoverEffect(target) > 0) {
								return 1;
							}
							if (player.canUse('sha', target) && (player.countCards('h', 'sha') || player.countCards('he', {
										color: 'red'
									}))) {
								return -2;
							}
							return -0.5;
						},
					},
					order: 9,
				},
			},
			tps_wencai: {
				audio: 2,
				trigger: {
					target: "shaBefore",
				},
				direct: true,
				priority: 5,
				filter: function (event, player) {
					if (player.countCards('he') == 0)
						return false;
					return game.hasPlayer(function (current) {
						return get.distance(player, current, 'attack') <= 1 && current != event.player &&
						current != player && lib.filter.targetEnabled(event.card, event.player, current);
					});
				},
				content: function () {
					"step 0"
					var next = player.chooseCardTarget({
							position: 'he',
							filterCard: lib.filter.cardDiscardable,
							filterTarget: function (card, player, target) {
								var trigger = _status.event.getTrigger();
								if (get.distance(player, target, 'attack') <= 1 &&
									target != trigger.player && target != player) {
									if (player.canUse(trigger.card, target))
										return true;
								}
								return false;
							},
							ai1: function (card) {
								return get.unuseful(card) + 9;
							},
							ai2: function (target) {
								if (_status.event.player.countCards('h', 'shan')) {
									return -get.attitude(_status.event.player, target);
								}
								if (get.attitude(_status.event.player, target) < 5) {
									return 6 - get.attitude(_status.event.player, target);
								}
								if (_status.event.player.hp == 1 && player.countCards('h', 'shan') == 0) {
									return 10 - get.attitude(_status.event.player, target);
								}
								if (_status.event.player.hp == 2 && player.countCards('h', 'shan') == 0) {
									return 8 - get.attitude(_status.event.player, target);
								}
								return -1;
							},
							prompt: get.prompt('tps_wencai')
						});
					"step 1"
					if (result.bool) {
						player.discard(result.cards);
						player.logSkill(event.name, result.targets);
						trigger.target = result.targets[0];
						trigger.targets.remove(player);
						trigger.targets.push(result.targets[0]);
					} else {
						event.finish();
					}
					"step 2"
					trigger.untrigger();
					trigger.trigger('useCardToBefore');
					trigger.trigger('shaBefore');
					game.delay();
				},
				ai: {
					effect: {
						target: function (card, player, target) {
							if (target.countCards('he') == 0)
								return;
							if (card.name != 'sha')
								return;
							var min = 1;
							var friend = get.attitude(player, target) > 0;
							var vcard = {
								name: 'shacopy',
								nature: card.nature,
								suit: card.suit
							};
							var players = game.filterPlayer();
							for (var i = 0; i < players.length; i++) {
								if (player != players[i] &&
									get.attitude(target, players[i]) < 0 &&
									target.canUse(card, players[i])) {
									if (!friend)
										return 0;
									if (get.effect(players[i], vcard, player, player) > 0) {
										if (!player.canUse(card, players[0])) {
											return [0, 0.1];
										}
										min = 0;
									}
								}
							}
							return min;
						},
					},
				},
			},
			tps_jinye: {
				mod: {
					cardUsable: function (card, player, num) {
						if (card.name == 'sha')
							return Infinity;
					},
				},
				ai: {
					unequip: true,
					skillTagFilter: function (player, tag, arg) {
						if (!get.zhu(player, 'shouyue'))
							return false;
						if (arg && arg.name == 'sha')
							return true;
						return false;
					},
				},
			},
			tps_fanxing: {
				audio: 1,
				filter: function (event, player) {
					return player.countCards('he', {
						suit: 'club'
					}) > 0;
				},
				enable: "chooseToUse",
				filterCard: function (card) {
					return get.suit(card) == 'club';
				},
				position: "he",
				viewAs: {
					name: "taoyuan",
				},
				prompt: "将一张科学牌当集体补课使用",
				check: function (card) {
					return 6 - get.value(card)
				},
				ai: {
					threaten: 1.5,
					basic: {
						order: 1,
						useful: 1,
						value: 8,
					},
					result: {
						target: function (player, target) {
							var num = target.hp - target.countCards('h') - 2;
							if (num > -1)
								return -0.01;
							if (target.hp < 3)
								num--;
							if (target.isTurnedOver())
								num /= 2;
							var dist = get.distance(player, target, 'absolute');
							if (dist < 1)
								dist = 1;
							return num / Math.sqrt(dist);
						},
					},
					tag: {
						skip: "phaseUse",
						recover: 0.5,
						multitarget: 1,
					},
				},
			},
			tps_guanban: {
				forced: true,
				locked: true,
				group: ["wushuang1", "wushuang2"],
			},
			tps_kuanrong: {
				audio: 2,
				enable: "phaseUse",
				filterCard: true,
				usable: 1,
				check: function (card) {
					return 9 - get.value(card)
				},
				filterTarget: function (card, player, target) {
					if (target.hp >= target.maxHp)
						return false;
					return true;
				},
				content: function () {
					target.recover();
				},
				ai: {
					order: 9,
					result: {
						target: function (player, target) {
							if (target.hp == 1)
								return 5;
							if (player == target && player.countCards('h') > player.hp)
								return 5;
							return 2;
						},
					},
					threaten: 2,
				},
			},
			tps_chaqin: {
				audio: 4,
				enable: "chooseToUse",
				filterCard: function (card) {
					return true;
				},
				position: "he",
				viewAs: {
					name: "guohe",
					suit: "club",
					number: 12,
					cards: [{
							"node": {
								"image": {},
								"info": {},
								"name": {},
								"name2": {},
								"background": {},
								"intro": {},
								"range": {}
							},
							"storage": {},
							"vanishtag": [],
							"_uncheck": [],
							"suit": "club",
							"number": 12,
							"name": "jiedao",
							"cardid": "1499923260",
							"clone": {
								"name": "jiedao",
								"suit": "club",
								"number": 12,
								"node": {
									"name": {},
									"info": {},
									"intro": {},
									"background": {},
									"image": {}
								},
								"_transitionEnded": true,
								"timeout": 311
							},
							"timeout": 288,
							"original": "h"
						}
					],
				},
				viewAsFilter: function (player) {
					return true;
				},
				prompt: "将一张任意牌当查寝使用",
				check: function (card) {
					return 4 - get.value(card)
				},
				ai: {
					basic: {
						order: 9,
						useful: 1,
						value: 5,
					},
					result: {
						target: function (player, target) {
							var att = get.attitude(player, target);
							var nh = target.countCards('h');
							if (att > 0) {
								var js = target.getCards('j');
								if (js.length) {
									var jj = js[0].viewAs ? {
										name: js[0].viewAs
									}
									 : js[0];
									if (jj.name == 'guohe' || js.length > 1 || get.effect(target, jj, target, player) < 0) {
										return 3;
									}
								}
								if (target.getEquip('baiyin') && target.isDamaged() &&
									get.recoverEffect(target, player, player) > 0) {
									if (target.hp == 1 && !target.hujia)
										return 1.6;
									if (target.hp == 2)
										return 0.01;
									return 0;
								}
							}
							var es = target.getCards('e');
							var noe = (es.length == 0 || target.hasSkillTag('noe'));
							var noe2 = (es.length == 1 && es[0].name == 'baiyin' && target.isDamaged());
							var noh = (nh == 0 || target.hasSkillTag('noh'));
							if (noh && (noe || noe2))
								return 0;
							if (att <= 0 && !target.countCards('he'))
								return 1.5;
							return -1.5;
						},
					},
					tag: {
						loseCard: 1,
						discard: 1,
					},
				},
			},
			tps_chachu: {
				audio: 1,
				filter: function (event, player) {
					return player.countCards('he', {
						suit: 'club'
					}) > 0;
				},
				enable: "chooseToUse",
				filterCard: function (card) {
					return get.suit(card) == 'club';
				},
				position: "he",
				viewAs: {
					name: "huogong",
					suit: "club",
					number: 1,
					cards: [{
							"node": {
								"image": {},
								"info": {},
								"name": {},
								"name2": {},
								"background": {},
								"intro": {},
								"range": {}
							},
							"storage": {},
							"vanishtag": [],
							"_uncheck": [],
							"suit": "club",
							"number": 1,
							"name": "baiyin",
							"cardid": "7286903264",
							"clone": {
								"name": "baiyin",
								"suit": "club",
								"number": 1,
								"node": {
									"name": {},
									"info": {},
									"intro": {},
									"background": {},
									"image": {}
								},
								"_transitionEnded": true,
								"timeout": 1156
							},
							"original": "e",
							"timeout": 1113
						}
					],
				},
				prompt: "将一张科学牌当抽查使用",
				check: function (card) {
					return 6 - get.value(card)
				},
				ai: {
					threaten: 1.5,
					basic: {
						order: 1,
						useful: 1,
						value: 8,
					},
					result: {
						target: function (player, target) {
							var num = target.hp - target.countCards('h') - 2;
							if (num > -1)
								return -0.01;
							if (target.hp < 3)
								num--;
							if (target.isTurnedOver())
								num /= 2;
							var dist = get.distance(player, target, 'absolute');
							if (dist < 1)
								dist = 1;
							return num / Math.sqrt(dist);
						},
						player: function (player) {
							var nh = player.countCards('h');
							if (nh <= player.hp && nh <= 4 && _status.event.name == 'chooseToUse') {
								if (typeof _status.event.filterCard == 'function' &&
									_status.event.filterCard({
										name: 'huogong'
									})) {
									return -10;
								}
								if (_status.event.skill) {
									var viewAs = get.info(_status.event.skill).viewAs;
									if (viewAs == 'huogong')
										return -10;
									if (viewAs && viewAs.name == 'huogong')
										return -10;
								}
							}
							return 0;
						},
					},
					tag: {
						skip: "phaseUse",
						damage: 1,
						fireDamage: 1,
						natureDamage: 1,
						norepeat: 1,
					},
					wuxie: function (target, card, player, current, state) {
						if (get.attitude(current, player) >= 0 && state > 0)
							return false;
					},
				},
			},
			tps_laoshou: {
				audio: 2,
				trigger: {
					player: "phaseDrawBegin",
				},
				frequent: true,
				content: function () {
					trigger.num++;
				},
				ai: {
					threaten: 1.3,
				},
			},
			tps_laolian: {
				mod: {
					maxHandcard: function (player, num) {
						return num + 1;
					},
				},
			},
			tps_huashui: {
				mod: {
					targetEnabled: function (card, player, target, now) {
						if (target.countCards('h') == 0) {
							if (card.name == 'sha' || card.name == 'juedou')
								return false;
						}
					},
				},
				group: "kongcheng1",
				ai: {
					noh: true,
					skillTagFilter: function (player, tag) {
						if (tag == 'noh') {
							if (player.countCards('h') != 1)
								return false;
						}
					},
				},
			},
			tps_wudi: {
				trigger: {
					global: "gameStart",
				},
				forced: true,
				unique: true,
				content: function () {
					//player.maxHp = Infinity;
					//player.hp = player.maxHp;
					//player.update();
					player.draw(4);
				},
			},
			tps_shoucuo: {
				trigger: {
					player: "damageEnd",
				},
				forced: true,
				audio: 2,
				content: function () {
					player.chooseToDiscard('he', true, 2);
				},
				ai: {},
			},
			tps_duoluo: {
				skillAnimation: true,
				audio: 2,
				unique: true,
				priority: -10,
				derivation: "guanxing",
				trigger: {
					player: "phaseBeginStart",
				},
				forced: true,
				filter: function (event, player) {
					if (player.storage.tps_duoluo)
						return false;
					return player.countCards('h') == 0;
				},
				content: function () {
					"step 0"
					player.awakenSkill('tps_duoluo');
					player.die();
				},
			},
			tps_yali: {
				audio: "luanji",
				enable: "phaseUse",
				viewAs: {
					name: "wanjian",
				},
				filterCard: function (card, player) {
					if (!player.storage.reluanji)
						return true;
					return !player.storage.reluanji.contains(get.suit(card));
				},
				selectCard: 2,
				check: function (card) {
					var player = _status.event.player;
					var targets = game.filterPlayer(function (current) {
							return player.canUse('wanjian', current);
						});
					var num = 0;
					for (var i = 0; i < targets.length; i++) {
						var eff = get.sgn(get.effect(targets[i], {
									name: 'wanjian'
								}, player, player));
						if (targets[i].hp == 1) {
							eff *= 1.5;
						}
						num += eff;
					}
					if (!player.needsToDiscard(-1)) {
						if (targets.length >= 7) {
							if (num < 2)
								return 0;
						} else if (targets.length >= 5) {
							if (num < 1.5)
								return 0;
						}
					}
					return 6 - get.value(card);
				},
				ai: {
					basic: {
						order: 10,
						useful: 1,
						value: 5,
					},
					wuxie: function (target, card, player, viewer) {
						if (get.attitude(viewer, target) > 0 && target.countCards('h', 'shan')) {
							if (!target.countCards('h') || target.hp == 1 || Math.random() < 0.7)
								return 0;
						}
					},
					result: {
						target: function (player, target) {
							if (player.hasUnknown(2) && get.mode() != 'guozhan')
								return 0;
							var nh = target.countCards('h');
							if (get.mode() == 'identity') {
								if (target.isZhu && nh <= 2 && target.hp <= 1)
									return -100;
							}
							if (nh == 0)
								return -2;
							if (nh == 1)
								return -1.7
								return -1.5;
						},
					},
					tag: {
						respond: 1,
						respondShan: 1,
						damage: 1,
						multitarget: 1,
						multineg: 1,
					},
				},
				group: ["reluanji_count", "reluanji_reset", "reluanji_respond"],
				subSkill: {
					reset: {
						trigger: {
							player: "phaseAfter",
						},
						silent: true,
						filter: function (event, player) {
							return player.storage.reluanji ? true : false;
						},
						content: function () {
							delete player.storage.reluanji;
						},
						sub: true,
						forced: true,
						popup: false,
					},
					count: {
						trigger: {
							player: "useCard",
						},
						silent: true,
						filter: function (event) {
							return event.skill == 'reluanji';
						},
						content: function () {
							if (!player.storage.reluanji) {
								player.storage.reluanji = [];
							}
							for (var i = 0; i < trigger.cards.length; i++) {
								player.storage.reluanji.add(get.suit(trigger.cards[i]));
							}
						},
						sub: true,
						forced: true,
						popup: false,
					},
					respond: {
						trigger: {
							global: "respond",
						},
						silent: true,
						filter: function (event) {
							return event.getParent(2).skill == 'reluanji' && event.player.isDamaged();
						},
						content: function () {
							trigger.player.draw();
						},
						sub: true,
						forced: true,
						popup: false,
					},
				},
			},
			tps_weiwang: {
				mod: {
					maxHandcard: function (player, num) {
						if (player.hasZhuSkill('xueyi')) {
							return num + game.countPlayer(function (current) {
								if (player != current && current.group == 'wei')
									return 2;
							});
						}
						return num;
					},
				},
				zhuSkill: true,
			},
			tps_jingxin: {
				mod: {
					targetEnabled: function (card, player, target, now) {
						if (card.name == 'lebu' || card.name == 'bingliang')
							return false;
					},
				},
				ai: {},
			},
			tps_yifen: {
				audio: 4,
				forbid: ["boss"],
				trigger: {
					player: "dieBegin",
				},
				forced: true,
				filter: function (event) {
					return event.source && event.source.isIn();
				},
				content: function () {
					trigger.source.damage(3, "thunder");
				},
				logTarget: "source",
				ai: {
					threaten: function (player, target) {
						if (target.hp == 1)
							return 0.2;
						return 1.5;
					},
					effect: {
						target: function (card, player, target, current) {
							if (!target.hasFriend())
								return;
							if (target.hp <= 1 && get.tag(card, 'damage'))
								return [1, 0, 0, -2];
						},
					},
				},
			},
			tps_bier: {
				mod: {
					targetEnabled: function (card, player, target, now) {
						if (card.name == 'sha')
							return false;
					},
				},
				ai: {},
			},
			tps_weigui: {
				ai: {
					unequip: true,
					skillTagFilter: function (player, tag, arg) {
						if (arg && arg.name == 'sha')
							return true;
						return false;
					},
				},
			},
			tps_yuanhuo: {
				trigger: {
					player: "useCardToBefore",
				},
				priority: 7,
				forced: true,
				filter: function (event, player) {
					if (event.card.name == 'sha' && !event.card.nature)
						return true;
				},
				audio: true,
				check: function (event, player) {
					var att = get.attitude(player, event.target);
					if (event.target.hasSkillTag('nofire')) {
						return att > 0;
					}
					return att <= 0;
				},
				content: function () {
					trigger.card.nature = 'fire';
					player.addSkill('zhuque_skill2');
					player.storage.zhuque_skill = trigger.card;
				},
			},
			tps_qianshui: {
				mod: {
					targetEnabled: function (card) {
						if ((get.type(card) == 'trick' || get.type(card) == 'delay') &&
							get.color(card) == 'black')
							return false;
					},
				},
			},
			tps_renqing: {
				trigger: {
					player: "damageBegin",
				},
				forced: true,
				audio: true,
				filter: function (event, player) {
					if (event.num <= 1)
						return false;
					if (event.source && event.source.hasSkillTag('unequip', false, {
							name: event.card ? event.card.name : null,
							target: player,
							card: event.card
						}))
						return false;
					return true;
				},
				priority: -10,
				content: function () {
					trigger.num = 1;
				},
			},
			tps_baohou: {
				audio: 2,
				unique: true,
				enable: "phaseUse",
				limited: true,
				skillAnimation: "epic",
				animationColor: "thunder",
				filter:function(event,player){
				    if(player.storage.tps_baohou) return false;
				    return true;
				},
				filterTarget: function (card, player, target) {
					return target != player;
				},
				selectTarget: -1,
				multitarget: true,
				multiline: true,
				content: function () {
					"step 0"
					player.awakenSkill('luanwu');
					event.current = player.next;
					"step 1"
					event.current.animate('target');
					event.current.chooseToUse('暴吼：使用一张问或失去一点分数', {
						name: 'sha'
					}, function (card, player, target) {
						if (player == target)
							return false;
						if (!player.canUse('sha', target))
							return false;
						if (get.distance(player, target) <= 1)
							return true;
						if (game.hasPlayer(function (current) {
								return current != player && get.distance(player, current) < get.distance(player, target);
							})) {
							return false;
						}
						return true;
					});
					"step 2"
					if (result.bool == false)
						event.current.loseHp();
					if (event.current.next != player) {
						event.current = event.current.next;
						game.delay(0.5);
						event.goto(1);
					}
					player.storage.tps_baohou=true;
				},
				ai: {
					order: 1,
					result: {
						player: function (player) {
							if (lib.config.mode == 'identity' && game.zhu.isZhu && player.identity == 'fan') {
								if (game.zhu.hp == 1 && game.zhu.countCards('h') <= 2)
									return 1;
							}
							var num = 0;
							var players = game.filterPlayer();
							for (var i = 0; i < players.length; i++) {
								var att = get.attitude(player, players[i]);
								if (att > 0)
									att = 1;
								if (att < 0)
									att = -1;
								if (players[i] != player && players[i].hp <= 3) {
									if (players[i].countCards('h') == 0)
										num += att / players[i].hp;
									else if (players[i].countCards('h') == 1)
										num += att / 2 / players[i].hp;
									else if (players[i].countCards('h') == 2)
										num += att / 4 / players[i].hp;
								}
								if (players[i].hp == 1)
									num += att * 1.5;
							}
							if (player.hp == 1) {
								return -num;
							}
							if (player.hp == 2) {
								return -game.players.length / 4 - num;
							}
							return -game.players.length / 3 - num;
						},
					},
				},
				mark: true,
				intro: {
					content: "limited",
				},
				init: function (player) {
					player.storage.tps_baohou=false;
				},
			},
			tps_juehou: {
				trigger: {
					player: "shaHit",
				},
				direct: true,
				audio: true,
				filter: function (event) {
					return true;
				},
				content: function () {
					"step 0"
					player.chooseBool('是否发动【绝后】？').set('logSkill', 'tps_juehou');
					"step 1"
					if (result.bool) {
						trigger.target.turnOver();
						trigger.untrigger();
						trigger.unhurt = true;
					}
				},
			},
			tps_youxiu: {
				trigger: {
					target: "shaBefore",
				},
				forced: true,
				priority: 6,
				audio: true,
				filter: function (event, player) {
					return (event.card.name == 'sha' && get.color(event.card) == 'black')
				},
				content: function () {
					trigger.cancel();
				},
				ai: {
					effect: {
						target: function (card, player) {
							if (card.name == 'sha' && get.color(card) == 'black')
								return 'zerotarget';
						},
					},
				},
			},
			tps_shigu: {
				audio: 2,
				enable: "phaseUse",
				usable: 1,
				filterCard: true,
				check: function (card) {
					return 8 - get.value(card);
				},
				position: "he",
				content: function () {
					player.loseHp();
				},
				ai: {
					order: 8,
					result: {
						player: function (player) {
							if (player.hp <= 2)
								return player.countCards('h') == 0 ? 1 : 0;
							if (player.countCards('h', {
									name: 'sha',
									color: 'red'
								}))
								return 1;
							return player.countCards('h') <= player.hp ? 1 : 0;
						},
					},
					effect: function (card, player, target) {
						if (get.tag(card, 'damage')) {
							if (player.hasSkillTag('jueqing', false, target))
								return [1, 1];
							return 1.2;
						}
						if (get.tag(card, 'loseHp')) {
							if (player.hp <= 1)
								return;
							return [0, 0];
						}
					},
				},
			},
			tps_zhuangzhuang: {
				trigger: {
					player: ["loseHpEnd", "damageEnd"],
				},
				forced: true,
				audio: 2,
				content: function () {
					player.draw(3);
					if (_status.currentPhase == player) {
						player.addTempSkill('tps_zhuangzhuang2', {
							player: 'phaseAfter'
						});
					} else {
						game.trySkillAudio('zhaxiang', player);
					}
				},
				ai: {
					maihp: true,
				},
			},
			tps_zhuangzhuang2: {
				mod: {
					targetInRange: function (card, player, target, now) {
						if (card.name == 'sha' && get.color(card) == 'red')
							return true;
					},
					cardUsable: function (card, player, num) {
						if (card.name == 'sha')
							return num + 1;
					}
				},
				trigger: {
					player: 'shaBegin'
				},
				forced: true,
				filter: function (event, player) {
					return event.card && get.color(event.card) == 'red';
				},
				content: function () {
					trigger.directHit = true;
				}
			},
			tps_yinshang: {
				audio: 2,
				audioname: ["boss_qinglong"],
				trigger: {
					player: "respond",
				},
				filter: function (event, player) {
					return event.card.name == 'shan';
				},
				direct: true,
				content: function () {
					"step 0";
					player.chooseTarget(get.prompt('tps_yinshang')).ai = function (target) {
						if (target.hasSkill('hongyan'))
							return 0;
						return get.damageEffect(target, _status.event.player, _status.event.player, 'thunder');
					};
					"step 1"
					if (result.bool) {
						player.logSkill('tps_yinshang', result.targets, 'thunder');
						event.target = result.targets[0];
						event.target.judge(function (card) {
							var suit = get.suit(card);
							if (suit == 'spade')
								return -4;
							if (suit == 'club')
								return -2;
							return 0;
						});
					} else {
						event.finish();
					}
					"step 2"
					if (result.suit == 'club') {
						event.target.damage('thunder');
						player.recover();
					} else if (result.suit == 'spade') {
						event.target.damage(2, 'thunder');
					}
				},
				ai: {
					useShan: true,
					effect: {
						target: function (card, player, target, current) {
							if (get.tag(card, 'respondShan')) {
								var hastarget = game.hasPlayer(function (current) {
										return get.attitude(target, current) < 0;
									});
								var be = target.countCards('e', {
										color: 'black'
									});
								if (target.countCards('h', 'shan') && be) {
									if (!target.hasSkill('tps_wulai'))
										return 0;
									return [0, hastarget ? target.countCards('he') / 2 : 0];
								}
								if (target.countCards('h', 'shan') && target.countCards('h') > 2) {
									if (!target.hasSkill('tps_wulai'))
										return 0;
									return [0, hastarget ? target.countCards('h') / 4 : 0];
								}
								if (target.countCards('h') > 3 || (be && target.countCards('h') >= 2)) {
									return [0, 0];
								}
								if (target.countCards('h') == 0) {
									return [1.5, 0];
								}
								if (target.countCards('h') == 1 && !be) {
									return [1.2, 0];
								}
								if (!target.hasSkill('tps_wulai'))
									return [1, 0.05];
								return [1, Math.min(0.5, (target.countCards('h') + be) / 4)];
							}
						},
					},
				},
			},
			tps_wulai: {
				audio: 2,
				trigger: {
					global: "judge",
				},
				filter: function (event, player) {
					return player.countCards('he', {
						color: 'black'
					}) > 0;
				},
				direct: true,
				content: function () {
					"step 0"
					player.chooseCard(get.translation(trigger.player) + '的' + (trigger.judgestr || '') + '判定为' +
						get.translation(trigger.player.judging[0]) + '，' + get.prompt('tps_wulai'), 'he', function (card) {
						return get.color(card) == 'black';
					}).set('ai', function (card) {
						var trigger = _status.event.getTrigger();
						var player = _status.event.player;
						var judging = _status.event.judging;
						var result = trigger.judge(card) - trigger.judge(judging);
						var attitude = get.attitude(player, trigger.player);
						if (attitude == 0 || result == 0)
							return 0;
						if (attitude > 0) {
							return result;
						} else {
							return -result;
						}
					}).set('judging', trigger.player.judging[0]);
					"step 1"
					if (result.bool) {
						player.respond(result.cards, 'highlight');
					} else {
						event.finish();
					}
					"step 2"
					if (result.bool) {
						player.logSkill('tps_wulai');
						player.$gain2(trigger.player.judging[0]);
						player.gain(trigger.player.judging[0]);
						trigger.player.judging[0] = result.cards[0];
						if (!get.owner(result.cards[0], 'judge')) {
							trigger.position.appendChild(result.cards[0]);
						}
						game.log(trigger.player, '的判定牌改为', result.cards[0]);
					}
					"step 3"
					game.delay(2);
				},
				ai: {
					tag: {
						rejudge: 1,
					},
				},
			},
			/*
			tps_tianshi:{
			audio:"guanxing",
			alter:true,
			trigger:{
			player:["phaseBegin","phaseEnd"],
			},
			frequent:true,
			filter:function(event,player,name){
			if(name=='phaseEnd'){
			return player.hasSkill('xinguanxing_on');
			}
			return true;
			},
			content:function(){
			'step 0'
			if(get.is.altered('xinguanxing')){
			event.num=game.countPlayer()<4?3:5;
			}
			else{
			event.num=Math.min(5,game.countPlayer());
			}
			event.cards=get.cards(event.num);
			event.chosen=[];
			event.num1=0;
			event.num2=0;
			event.bottom=-1;
			'step 1'
			var js=player.getCards('j');
			var pos;
			var choice=-1;
			var getval=function(card,pos){
			if(js[pos]){
			return (get.judge(js[pos]))(card);
			}
			else if(event.triggername=='phaseEnd'&&get.attitude(player,player.getNext())<=0){
			return 11.5-get.value(card,player);
			}
			else{
			return get.value(card,player);
			}
			};
			event.discard=false;
			var minval=6;
			for(pos=0;pos<event.cards.length;pos++){
			var max=getval(event.cards[pos],pos);
			for(var j=pos+1;j<event.cards.length;j++){
			var current=getval(event.cards[j],pos);
			if(current>max){
			choice=j;
			max=current;
			}
			}
			if(event.bottom<0){
			if(!js[pos]){
			if(max<minval){
			event.bottom=pos;
			}
			}
			else if(max<0){
			event.bottom=pos;
			}
			}
			if(event.bottom>=0&&event.bottom<=pos){
			choice=pos;
			event.discard=true;break;
			}
			if(choice!=-1){
			break;
			}
			}
			player.chooseCardButton('观星：选择要移动的牌',event.cards).set('filterButton',function(button){
			return !_status.event.chosen.contains(button.link);
			}).set('chosen',event.chosen).set('ai',function(button){
			return button.link==_status.event.choice?1:0;
			}).set('choice',event.cards[choice]);
			event.pos=pos;
			'step 2'
			if(result.bool){
			var card=result.links[0];
			var index=event.cards.indexOf(card);
			event.card=card;
			event.chosen.push(card);
			event.cards.remove(event.card);
			var controlai=event.pos||0;
			if(event.discard){
			controlai=event.cards.length+1;
			}
			var buttons=event.cards.slice(0);
			player.chooseControl(function(){
			return _status.event.controlai;
			}).set('controlai',controlai).set('sortcard',buttons).set('tosort',card);
			}
			else{
			event.goto(4);
			}
			'step 3'
			if(typeof result.index=='number'){
			if(result.index>event.cards.length){
			ui.cardPile.appendChild(event.card);
			event.num2++;
			}
			else{
			event.cards.splice(result.index,0,event.card);
			}
			event.num--;
			if(event.num>0){
			event.goto(1);
			}
			}
			'step 4'
			while(event.cards.length){
			ui.cardPile.insertBefore(event.cards.pop(),ui.cardPile.firstChild);
			event.num1++;
			}
			var js=player.getCards('j');
			if(js.length==1){
			if((get.judge(js[0]))(ui.cardPile.firstChild)<0){
			player.addTempSkill('guanxing_fail');
			}
			}
			player.popup(get.cnNumber(event.num1)+'上'+get.cnNumber(event.num2)+'下');
			game.log(player,'将','#y'+get.cnNumber(event.num1)+'张牌','置于牌堆顶，','#y'+get.cnNumber(event.num2)+'张牌','置于牌堆底');
			if(event.triggername=='phaseBegin'&&get.is.altered('xinguanxing')&&event.num1==0){
			player.addTempSkill('xinguanxing_on');
			}
			},
			subSkill:{
			on:{
			sub:true,
			},
			},
			},*/
			tps_huyou: {
				unique: true,
				locked: true,
				group: ['tps_huyou1', 'tps_huyou2'],
				ai: {
					effect: {
						target: function (card) {
							if (card.name == 'nanman' || card.name == 'wanjian')
								return [0, 1];
						}
					}
				}
			},
			tps_huyou1: {
				audio: 2,
				trigger: {
					target: 'useCardToBefore'
				},
				forced: true,
				priority: 15,
				filter: function (event, player) {
					return (event.card.name == 'nanman' || event.card.name == 'wanjian');
				},
				content: function () {
					trigger.cancel();
				}
			},
			tps_huyou2: {
				trigger: {
					global: 'useCardAfter'
				},
				forced: true,
				filter: function (event, player) {
					return ((event.card.name == 'nanman' || event.card.name == 'wanjian') && event.player != player && get.position(event.card) == 'd' && get.itemtype(event.card) == 'card');
				},
				content: function () {
					player.gain(trigger.card);
					player.$gain2(trigger.card);
				}
			},
			tps_songwei: {
				unique: true,
				global: 'tps_songwei2',
				zhuSkill: true,
			},
			tps_songwei2: {
				audio: 2,
				forceaudio: true,
				trigger: {
					player: 'judgeEnd'
				},
				filter: function (event, player) {
					if (player.group != 'shu')
						return false;
					if (get.color(event.result.card) != 'black')
						return false;
					return game.hasPlayer(function (target) {
						return player != target && target.hasZhuSkill('tps_songwei', player);
					});
				},
				direct: true,
				content: function () {
					'step 0'
					var list = game.filterPlayer(function (current) {
							return current != player && current.hasZhuSkill('tps_songwei', player);
						});
					list.sortBySeat();
					event.list = list;
					'step 1'
					if (event.list.length) {
						var current = event.list.shift();
						event.current = current;
						player.chooseBool(get.prompt('tps_songwei', current)).set('choice', get.attitude(player, current) > 0);
					} else {
						event.finish();
					}
					'step 2'
					if (result.bool) {
						player.logSkill('tps_songwei', event.current);
						event.current.draw();
					}
					event.goto(1);
				}
			},
			tps_fengkuang: {
				audio: 2,
				unique: true,
				enable: "phaseUse",
				limited: true,
				skillAnimation: "epic",
				animationColor: "thunder",
				filterTarget: function (card, player, target) {
					return target != player;
				},
				selectTarget: -1,
				multitarget: true,
				multiline: true,
				content: function () {
					"step 0"
					player.awakenSkill('tps_fengkuang');
					event.current = player.next;
					"step 1"
					event.current.animate('target');
					event.current.damage('thunder');
					if (event.current.next != player) {
						event.current = event.current.next;
						game.delay(0.5);
						event.goto(1);
					}
				},
				ai: {
					order: 1,
					result: {
						player: function (player) {
							if (lib.config.mode == 'identity' && game.zhu.isZhu && player.identity == 'fan') {
								if (game.zhu.hp == 1)
									return 1;
							}
							var num = 0;
							var players = game.filterPlayer();
							for (var i = 0; i < players.length; i++) {
								var att = get.attitude(player, players[i]);
								if (att > 0)
									att = 1;
								if (att < 0)
									att = -1;
								if (players[i] != player && players[i].hp <= 3) {
									if (players[i].countCards('h') == 0)
										num += att / players[i].hp;
									else if (players[i].countCards('h') == 1)
										num += att / 2 / players[i].hp;
									else if (players[i].countCards('h') == 2)
										num += att / 4 / players[i].hp;
								}
								if (players[i].hp == 1)
									num += att * 1.5;
							}
							if (player.hp == 1) {
								return  - num;
							}
							if (player.hp == 2) {
								return  - game.players.length / 4 - num;
							}
							return  - game.players.length / 3 - num;
						},
					},
				},
			},
			tps_shikong: {
				audio: 2,
				unique: true,
				enable: "phaseUse",
				limited: true,
				skillAnimation: "epic",
				animationColor: "fire",
				filterTarget: function (card, player, target) {
					return target != player;
				},
				selectTarget: -1,
				multitarget: true,
				multiline: true,
				content: function () {
					"step 0"
					player.awakenSkill('tps_shikong');
					event.current = player.next;
					"step 1"
					event.current.animate('target');
					event.current.damage('fire');
					if (event.current.next != player) {
						event.current = event.current.next;
						game.delay(0.5);
						event.goto(1);
					}
				},
				ai: {
					order: 1,
					result: {
						player: function (player) {
							if (lib.config.mode == 'identity' && game.zhu.isZhu && player.identity == 'fan') {
								if (game.zhu.hp == 1)
									return 1;
							}
							var num = 0;
							var players = game.filterPlayer();
							for (var i = 0; i < players.length; i++) {
								var att = get.attitude(player, players[i]);
								if (att > 0)
									att = 1;
								if (att < 0)
									att = -1;
								if (players[i] != player && players[i].hp <= 3) {
									if (players[i].countCards('h') == 0)
										num += att / players[i].hp;
									else if (players[i].countCards('h') == 1)
										num += att / 2 / players[i].hp;
									else if (players[i].countCards('h') == 2)
										num += att / 4 / players[i].hp;
								}
								if (players[i].hp == 1)
									num += att * 1.5;
							}
							if (player.hp == 1) {
								return  - num;
							}
							if (player.hp == 2) {
								return  - game.players.length / 4 - num;
							}
							return  - game.players.length / 3 - num;
						},
					},
				},
			},
			tps_shenghua: {
				audio: "luoshen",
				alter: true,
				trigger: {
					player: "damageEnd",
				},
				frequent: true,
				content: function () {
					"step 0"
					if (event.cards == undefined)
						event.cards = [];
					player.judge(function (card) {
						if (get.color(card) == 'red')
							return 1.5;
						return  - 1.5;
					},
						ui.special);
					"step 1"
					if (result.judge > 0) {
						event.cards.push(result.card);
						if (lib.config.autoskilllist.contains('tps_shenghua')) {
							player.chooseBool('是否再次发动【生花】？');
						} else {
							event._result = {
								bool: true
							};
						}
					} else {
						for (var i = 0; i < event.cards.length; i++) {
							if (get.position(event.cards[i]) != 's') {
								event.cards.splice(i, 1);
								i--;
							}
						}
						player.gain(event.cards, 'gain2');
						player.storage.tps_shenghua = event.cards.slice(0);
						event.finish();
					}
					"step 2"
					if (result.bool) {
						event.goto(0);
					} else {
						if (event.cards.length) {
							player.gain(event.cards, 'gain2');
							player.storage.tps_shenghua = event.cards.slice(0);
						}
					}
				},
				mod: {
					ignoredHandcard: function (card, player) {
						if (get.is.altered('tps_shenghua') && player.storage.tps_shenghua && player.storage.tps_shenghua.contains(card)) {
							return true;
						}
					},
				},
				group: "shensi_clear",
				subSkill: {
					clear: {
						trigger: {
							player: "phaseAfter",
						},
						silent: true,
						content: function () {
							delete player.storage.tps_shenghua;
						},
						sub: true,
						forced: true,
						popup: false,
					},
				},
			},
			tps_xingyun: {
				audio: 2,
				trigger: {
					player: 'damageBegin'
				},
				filter: function (event, player) {
					return true;
				},
				check: function (event, player) {
					return true;
				},
				content: function () {
					"step 0"
					player.judge(function (card) {
						if (get.suit(card) == 'heart' && get.number(card) > 1 && get.number(card) < 10)
							return -1.5;
						return 1.5;
					}, ui.special);
					"step 1"
					if (result.judge>0) {
						trigger.cancel();
					}
				},
				ai: {
					expose: 0.4
				}
			},/*
			tps_luanma: {
				audio: 2,
				trigger: {
					player: 'phaseBegin',
				},
				alter: true,
				content: function () {
					"step 1"
					player.judge(function (card) {
						/-*
						if (get.suit(card)=='diamond' && get.number(card)<=5){
						return -1.5;
						}else if(get.suit(card)=='club' && get.number(card)<=5){
						return 1.5;
						}
						return 0;*-/
						if (get.suit(card) == 'club') {
							if (get.number(card) == 1) {
								return 3;
							} else if (get.number(card) == 2) {
								return 2.8;
							} else if (get.number(card) == 3) {
								return 2.6;
							} else if (get.number(card) == 4) {
								return 2.4;
							} else if (get.number(card) == 5) {
								return 2.2;
							}
							return 0.8;
						} else if (get.suit(card) == 'diamond') {
							if (get.number(card) == 1) {
								return -3;
							} else if (get.number(card) == 2) {
								return -2.8;
							} else if (get.number(card) == 3) {
								return -2.6;
							} else if (get.number(card) == 4) {
								return -2.4;
							} else if (get.number(card) == 5) {
								return -2.2;
							}
							return -1.5;
						}
						return 0;
					}, ui.special);
					/-*game.log(result.suit,'的判定牌改为',result.number);
					if(result.suit=='club'){
					player.die();
					if(result.number==1 && lib.config.mode == 'identity'){
					event.current = player.next;
					"step 3"
					if(player.identity=="zhu" || player.identity=="zhong"){
					if(event.current.identity=="fan" || event.current.identity=="nei"){
					event.current.animate('target');
					event.current.die();
					}
					}else if(player.identity=="fan"){
					if(event.current.identity=="zhu" || event.current.identity=="zhong"){
					event.current.animate('target');
					event.current.die();
					}
					}else{
					if(event.current.identity=="fan" || event.current.identity=="zhong"){
					event.current.animate('target');
					event.current.die();
					}
					}
					if (event.current.next != player) {
					event.current = event.current.next;
					game.delay(0.5);
					event.goto(3);
					}
					}else if(result.number==2){
					player.draw(10);
					}else if(result.number==3){
					player.draw(5);
					}else if(result.number==4){
					player.chooseTarget(get.prompt('tps_luanma'));
					if(result.bool){
					event.target=result.targets[0];
					event.target.die();
					}
					}else if(result.number==5){
					player.chooseTarget(get.prompt('tps_luanma'));
					if(result.bool){
					event.target=result.targets[0];
					event.target.turnOver();
					}
					}
					return 1.5;
					}else if(result.suit=='diamond'){
					player.die();
					if(result.number==1 && lib.config.mode == 'identity'){
					event.current = player.next;
					"step 3"
					if(player.identity=="zhu" || player.identity=="zhong"){
					if(event.current.identity=="zhu" || event.current.identity=="zhong"){
					event.current.animate('target');
					event.current.die();
					}
					}else if(player.identity=="fan"){
					if(event.current.identity=="fan"){
					event.current.animate('target');
					event.current.die();
					}
					}
					if (event.current.next != player && player.identity!="nei") {
					event.current = event.current.next;
					game.delay(0.5);
					event.goto(3);
					}else{
					player.die();
					}
					}else if(result.number==2){
					player.chooseToDiscard('he',true,10);
					player.skip('phaseUse');
					player.skip('phaseDraw');
					}else if(result.number==3){
					player.chooseToDiscard('he',true,5);
					}else if(result.number==4){
					player.die();
					}else if(result.number==4){
					player.turnOver();
					}
					return -1.5;
					};-*-/
					//if(result.judge>0){
					if (result.judge == 3.0) {
						if (lib.config.mode == 'identity') {
							event.current = player.next;
							"step 3"
							if (player.identity == "zhu" || player.identity == "zhong") {
								if (event.current.identity == "fan" || event.current.identity == "nei") {
									event.current.animate('target');
									event.current.die();
								}
							} else if (player.identity == "fan") {
								if (event.current.identity == "zhu" || event.current.identity == "zhong") {
									event.current.animate('target');
									event.current.die();
								}
							} else {
								if (event.current.identity != "zhu") {
									event.current.animate('target');
									event.current.die();
								} else {
									event.target = event.current;
								}
							}
							if (event.current.next != player) {
								event.current = event.current.next;
								game.delay(0.5);
								event.goto(3);
							} else if (player.identity == "nei") {
								event.target.animate('target');
								event.target.die();
							}
						} else {
							game.over(true);
						}
					} else if (result.judge == 2.8) {
						player.draw(10);
					} else if (result.judge == 2.6) {
						player.draw(5);
					} else if (result.judge == 2.4) {
						player.chooseTarget(get.prompt('tps_luanma'));
						if (result.bool) {
							event.target = result.targets[0];
							event.target.die();
						}
					} else if (result.judge == 2.2) {
						player.chooseTarget(get.prompt('tps_luanma')).ai = function (target) {
							if (target.hasSkillTag('noturn'))
								return 0;
							var player = _status.event.player;
							if (get.attitude(_status.event.player, target) == 0)
								return 0;
							if (get.attitude(_status.event.player, target) > 0) {
								if (target.classList.contains('turnedover'))
									return 1000 - target.countCards('h');
								if (player.maxHp - player.hp < 3)
									return -1;
								return 100 - target.countCards('h');
							} else {
								if (target.classList.contains('turnedover'))
									return -1;
								if (player.maxHp - player.hp >= 3)
									return -1;
								return 1 + target.countCards('h');
							}
						};
						if (result.bool) {
							event.target = result.targets[0];
							event.target.turnOver();
						}
					}
					//	return 1.5;
					//}else if(result.judge<0){
					if (result.judge == -3.0) {
						if (lib.config.mode == 'identity') {
							event.current = player.next;
							"step 3"
							if (player.identity == "zhu" || player.identity == "zhong") {
								if (event.current.identity == "zhu" || event.current.identity == "zhong") {
									event.current.animate('target');
									event.current.die();
								}
							} else if (player.identity == "fan") {
								if (event.current.identity == "fan") {
									event.current.animate('target');
									event.current.die();
								}
							}
							if (event.current.next != player && player.identity != "nei") {
								event.current = event.current.next;
								game.delay(0.5);
								event.goto(3);
							} else {
								player.die();
							}
						} else {
							game.over(false);
						}
					} else if (result.judge == -2.8) {
						player.chooseToDiscard('he', true, 10);
						player.skip('phaseUse');
						player.skip('phaseDraw');
					} else if (result.judge == -2.6) {
						player.chooseToDiscard('he', true, 5);
					} else if (result.judge == -2.4) {
						player.die();
					} else if (result.judge == -2.2) {
						player.turnOver();
					}
					//		return -1.5;
					//	}
					//		return 0;
				}
			},*/
			tps_shulian:{
				audio:2,
				trigger:{player:'phaseAfter'},
				forced: true,
				content:function(){
					player.insertPhase();
					target.addSkill('tps_shulian1');
				},
			},
			tps_shulian1:{
				audio:2,
				trigger:{player:'phaseStart'},
				forced: true,
				content:function(){
					player.skip('phaseAfter');
					target.removeSkill('tps_shulian1');
				},
			},
			tps_pengzhang:{
				audio:2,
				trigger:{source:'damageEnd'},
				forced:true,
				filter:function(event,player){
					return true;
				},
				content:function(){
					player.draw(trigger.num*2);
				}
			},
			tps_zhuli:{
				audio:1,
				filter:function(event,player){
					return player.countCards('he',{color:'red'})>0;
				},
				enable:'chooseToUse',
				filterCard:function(card){
					return get.color(card)=='red';
				},
				position:'he',
				viewAs:{name:'huogong'},
				prompt:'将一张文科牌当抽查使用',
				check:function(card){return 6-get.value(card)},
				ai:{
					threaten:1.5
				}
			},
			tps_zhitiao :{
				audio:2,
				trigger:{player:['respond','useCard']},
				frequent:true,
				filter:function(event,player){
					return get.itemtype(event.cards)=='cards';
				},
				content:function(){
					"step 0"
					event.card=get.cards()[0];
					game.broadcast(function(card){
						ui.arena.classList.add('thrownhighlight');
						card.copy('thrown','center','thrownhighlight',ui.arena).animate('start');
					},event.card);
					event.node=event.card.copy('thrown','center','thrownhighlight',ui.arena).animate('start');
					ui.arena.classList.add('thrownhighlight');
					game.addVideo('thrownhighlight1');
					game.addVideo('centernode',null,get.cardInfo(event.card));
					if(get.type(event.card,'trick')==get.type(trigger.card,'trick')){
						player.chooseTarget('选择获得此牌的角色').set('ai',function(target){
							var att=get.attitude(_status.event.player,target);
							if(_status.event.du){
								if(target.hasSkillTag('nodu')) return 0;
								return -att;
							}
							if(att>0){
								return att+Math.max(0,5-target.countCards('h'));
							}
							return att;
						}).set('du',event.card.name=='du');
					}
					else{
						player.chooseBool('是否弃置'+get.translation(event.card)+'？');
						event.disbool=true;
					}
					game.delay(2);
					"step 1"
					if(event.disbool){
						if(!result.bool){
							game.log(player,'展示了',event.card);
							ui.cardPile.insertBefore(event.card,ui.cardPile.firstChild);
						}
						else{
							game.log(player,'展示并弃掉了',event.card);
							event.card.discard();
						}
						game.addVideo('deletenode',player,[get.cardInfo(event.node)]);
						event.node.delete();
						game.broadcast(function(card){
							ui.arena.classList.remove('thrownhighlight');
							if(card.clone){
								card.clone.delete();
							}
						},event.card);
					}
					else if(result.targets){
						player.line(result.targets,'green');
						result.targets[0].gain(event.card,'log');
						event.node.moveDelete(result.targets[0]);
						game.addVideo('gain2',result.targets[0],[get.cardInfo(event.node)]);
						game.broadcast(function(card,target){
							ui.arena.classList.remove('thrownhighlight');
							if(card.clone){
								card.clone.moveDelete(target);
							}
						},event.card,result.targets[0]);
					}
					else{
						game.log(player,'展示并弃掉了',event.card);
						event.card.discard();
						game.addVideo('deletenode',player,[get.cardInfo(event.node)]);
						event.node.delete();
						game.broadcast(function(card){
							ui.arena.classList.remove('thrownhighlight');
							if(card.clone){
								card.clone.delete();
							}
						},event.card);
					}
					game.addVideo('thrownhighlight2');
					ui.arena.classList.remove('thrownhighlight');
				},
				ai:{
					effect:{
						target:function(card,player){
							if(get.tag(card,'respond')&&player.countCards('h')>1) return [1,0.2];
						}
					}
				}
			},
			tps_tongxiao:{
				mod: {
					targetEnabled: function (card, player, target, now) {
						if (card.name == 'chaqin')
							return false;
					},
				},
				ai: {},
			},
			tps_gemo:{
				mod:{
					globalTo:function(from,to,current){
						return current+3;
					},
				},
				ai:{
					threaten:0.8
				}
			},
			tps_qiangpo:{
				audio:2,
				trigger:{player:'shaBegin'},
				check:function(event,player){
					return get.attitude(player,event.target)<=0;
				},
				logTarget:'target',
				filter:function(event,player){
					var length=event.target.countCards('h');
					return (length>=player.hp||length<=player.getAttackRange());
				},
				content:function(){
					trigger.directHit=true;
				},
				locked:false,
				mod:{
					attackFrom:function(from,to,distance){
						if(get.zhu(from,'shouyue')) return distance-1;
					}
				}
			},
			tps_cangni:{
				init:function(player){
					player.storage.tps_cangni2=[];
				},
				audio:2,
				trigger:{target:'useCardToBegin',player:'judgeBefore'},
				filter:function(event,player){
					if(player.countCards('h')==0) return false;
					if(event.parent.name=='phaseJudge'){
						if(lib.skill.tps_cangni.trigger.player=='judgeBefore'){
							return true;
						}
						return event.result&&event.result.judge!=0;
					}
					if(event.name=='judge') return false;
					if(event.targets&&event.targets.length>1) return false;
					if(event.card&&get.type(event.card)=='trick'&&event.player!=player) return true;
				},
				content:function(){
					player.storage.tps_cangni2=player.storage.tps_cangni2.concat(player.getCards('h'));
					game.addVideo('storage',player,['tps_cangni2',get.cardsInfo(player.storage.tps_cangni2),'cards']);
					player.lose(player.getCards('h'),ui.special);
					player.addSkill('tps_cangni2');
				},
				ai:{
					effect:function(card,player,target){
						if(!target.hasFriend()) return;
						if(player==target) return;
						var type=get.type(card);
						var nh=target.countCards();
						if(type=='trick'){
							if(!get.tag(card,'multitarget')||get.info(card).singleCard){
								if(get.tag(card,'damage')){
									if(nh<3||target.hp<=2) return 0.8;
								}
								return [1,nh];
							}
						}
						else if(type=='delay'){
							return [0.5,0.5];
						}
					},
				}
			},
			tps_cangni2:{
				trigger:{global:'phaseAfter'},
				forced:true,
				audio:false,
				content:function(){
					player.gain(player.storage.tps_cangni2);
					player.removeSkill('tps_cangni2');
					player.storage.tps_cangni2=[];
					game.addVideo('storage',player,['tps_cangni2',get.cardsInfo(player.storage.tps_cangni2),'cards']);
				},
				mark:true,
				intro:{
					content:'cardCount'
				}
			},
			tps_zhuanzhu:{
				locked:true,
				global:'tps_zhuanzhu2',
				trigger:{global:'dying'},
				priority:15,
				forced:true,
				filter:function(event,player){
					return _status.currentPhase==player&&event.player!=player;
				},
				content:function(){}
			},
			tps_zhuanzhu2:{
				mod:{
					cardSavable:function(card,player){
						if(!_status.currentPhase) return;
						if(_status.currentPhase.hasSkill('tps_zhuanzhu')&&_status.currentPhase!=player){
							if(card.name=='tao'&&_status.event.dying!=player) return false;
						}
					}
				}
			},
            tps_caiyi: {
				audio: 2,
				audioname: ["boss_qinglong"],
				trigger: {
					player: "respond",
				},
				filter: function (event, player) {
					return event.card.name == 'shan';
				},
				direct: true,
				content: function () {
					"step 0";
					player.chooseTarget(get.prompt('tps_caiyi')).ai = function (target) {
						if (target.hasSkill('hongyan'))
							return 0;
						return get.damageEffect(target, _status.event.player, _status.event.player, 'thunder');
					};
					"step 1"
					if (result.bool) {
						player.logSkill('tps_yinshang', result.targets, 'thunder');
						event.target = result.targets[0];
					} else {
						event.finish();
					}
					"step 2"
					
                    var next = player.useCard({
						name: 'sha'
					}, event.target, cards);
					next.animate = false;
					next.audio = false;
                    return 0;
				},
				ai: {
					useShan: true,
					effect: {
						target: function (card, player, target, current) {
							if (get.tag(card, 'respondShan')) {
								var hastarget = game.hasPlayer(function (current) {
										return get.attitude(target, current) < 0;
									});
								var be = target.countCards('e', {
										color: 'black'
									});
								if (target.countCards('h', 'shan') && be) {
									if (!target.hasSkill('tps_wulai'))
										return 0;
									return [0, hastarget ? target.countCards('he') / 2 : 0];
								}
								if (target.countCards('h', 'shan') && target.countCards('h') > 2) {
									if (!target.hasSkill('tps_wulai'))
										return 0;
									return [0, hastarget ? target.countCards('h') / 4 : 0];
								}
								if (target.countCards('h') > 3 || (be && target.countCards('h') >= 2)) {
									return [0, 0];
								}
								if (target.countCards('h') == 0) {
									return [1.5, 0];
								}
								if (target.countCards('h') == 1 && !be) {
									return [1.2, 0];
								}
								if (!target.hasSkill('tps_wulai'))
									return [1, 0.05];
								return [1, Math.min(0.5, (target.countCards('h') + be) / 4)];
							}
						},
					},
				},
			},
			tps_fuyou: {
				trigger: {
					source: "damageEnd",
				},
				alter: true,
				filter: function (event, player) {
					if (event.player == undefined)return false;
							return event.player.sex=='female';
				},
				forced: true,
				content: function () {
					if (!trigger.player.storage.tps_fuyou_mark) {
						trigger.player.storage.tps_fuyou_mark = 0;
					}
					trigger.player.storage.tps_fuyou_mark += trigger.num;
					trigger.player.syncStorage('tps_fuyou_mark');
					trigger.player.markSkill('tps_fuyou_mark');
				},
				global: ["tps_fuyou_mark"],
				subSkill: {
					mark: {
						marktext: "友尽",
						intro: {
							content: "mark",
						},
						sub: true,
					},
				},
				group: ["tps_fuyou2"],
			},
			tps_fuyou2: {
				audio: 2,
				forced:true,
				trigger: {
					player: 'damageBegin',
				},
				filter: function (event, player) {
				    if(!event.source)return false;
					return (event.source.sex=='female' && !event.source.storage.tps_fuyou_mark);
				},
				check: function (event, player) {
					return true;
				},
				content: function () {
					trigger.cancel();
					return 1.5;
				},
				ai: {
					expose: 0.4
				}
			},
			tps_mensao: {
				mod: {
					targetEnabled: function (card, player, target, now) {
						if (card.name == 'huogong'||card.name == 'guohe'||card.name == 'shunshou'||card.name == 'jiedao'||card.name == 'juedou')
							return false;
					},
				},
				ai: {},
			},
			tps_zuosi:{
				audio:4,
				enable:'phaseUse',
				prompt:'失去一点分数并摸两张牌',
				content:function(){
					"step 0"
					player.loseHp(1);
					"step 1"
					player.draw(2);
				},
				ai:{
					basic:{
						order:1
					},
					result:{
						player:function(player){
							if(player.countCards('h')>=player.hp-1) return -1;
							if(player.hp<3) return -1;
							return 1;
						}
					}
				}
			},
			tps_shangjin:{
				audio:2,
				trigger:{global:'discardAfter'},
				filter:function(event){
					if(_status.currentPhase!=event.player){
						for(var i=0;i<event.cards.length;i++){
							if(event.cards[i].original=='h') return true;
						}
					}
					return false;
				},
				check:function(event,player){
					return get.attitude(player,event.player)>2;
				},
				content:function(){
					"step 0"
					player.line(trigger.player,'green');
					player.loseHp();
					"step 1"
					trigger.player.draw(2);
				},
			},
			tps_shuipi: {
				audio:1,
				filter:function(event,player){
					return player.countCards('he',{suit:'heart'})>0;
				},
				enable:'chooseToUse',
				usable: 1,
				filterCard:function(card){
					return get.suit(card)=='heart';
				},
				position:'he',
				viewAs:{name:'wugu'},
				prompt:'将一张语文牌当【圈画重点】使用',
				check:function(card){return 6-get.value(card)},
				ai:{
					threaten:1.5
				},
			},
			tps_shulian:{
				trigger:{player:'phaseAfter'},
				forced:true,
				popup:false,
				audio:false,
				priority:-50,
				content:function(){
					player.markSkillCharacter('tps_shulian',player,'熟练','进行一个额外回合');
					player.insertPhase();
					player.addSkill('tps_shulian2');
				}
			},
			tps_shulian2:{
				trigger:{player:'phaseBegin'},
				forced:true,
				popup:false,
				audio:false,
				priority:-50,
				content:function(){
					player.removeSkill('tps_shulian');
					player.addSkill('tps_shulian3');
				}
			},
			tps_shulian3:{
				trigger:{player:'phaseAfter'},
				forced:true,
				popup:false,
				audio:false,
				priority:-50,
				content:function(){
					player.removeSkill('tps_shulian2');
					player.addSkill('tps_shulian');
				}
			},
			tps_feili:{
				audio:2,
				trigger:{player:'shaBegin'},
				forced:true,
				filter: function (event, player) {
					return event.target.sex=='male';
				},
				check:function(event,player){
					return get.attitude(player,event.target)<=0;
				},
				logTarget:'target',
				content:function(){
					"step 0"
					trigger.directHit=true;
				}
			},
			tps_juai: {
				audio: 2,
				forced:true,
				trigger: {
					player: 'damageEnd',
				},
				filter: function (event, player) {
					return event.source.sex=='male';
				},
				check: function (event, player) {
					return true;
				},
				content: function () {
					if (!player.storage.tps_juai_mark) {
						player.storage.tps_juai_mark = 0;
					}
					player.storage.tps_juai_mark += trigger.num;
					player.syncStorage('tps_juai_mark');
					player.markSkill('tps_juai_mark');
				},
				global: ["tps_juai_mark"],
				subSkill: {
					mark: {
						marktext: "拒",
						intro: {
							content: "mark",
						},
						sub: true,
					},
				},
				//group: ["tps_fuyou2"],
				ai: {
					expose: 0.4
				}
			},
			tps_huoai:{
				skillAnimation:true,
				audio:2,
				unique:true,
				derivation:['tps_baofu','tps_bufa','jizhi'],
				trigger:{player:'phaseBegin'},
				forced:true,
				filter:function(event,player){
					if(player.storage.tps_huoai) return false;
					if(!player.storage.tps_juai_mark) return false;
					if(player.storage.tps_juai_mark>=3) return true;
					return false;
				},
				content:function(){
					player.storage.tps_huoai=true;
					player.loseMaxHp();
					player.addSkill('tps_baofu');
					player.addSkill('tps_bufa');
					player.addSkill('rejizhi');
					player.awakenSkill('tps_huoai');
				}
			},
			tps_baofu:{
				audio:2,
				trigger:{player:'damageEnd'},
				filter:function(event,player){
					return (event.source!=undefined&&event.num>0&&event.source.sex=='male');
				},
				check:function(event,player){
					return (get.attitude(player,event.source)<=0);
				},
				logTarget:'source',
				content:function(){
					"step 0"
					event.num=trigger.num;
					"step 1"
					player.judge(function(card){
						if(get.color(card)=='black') return _status.event.eff;
						return 0;
					}).set('eff',get.damageEffect(trigger.source,player,player));
					"step 2"
					if(result.color=='black' && trigger.source.isIn()){
						trigger.source.damage();
					}
					event.num--;
					if(event.num>0){
						player.chooseBool('是否继续发动？');
					}
					else{
						event.finish();
					}
					"step 3"
					if(result.bool){
						event.goto(1);
					}
				},
				ai:{
					maixie_defend:true,
					expose:0.4
				}
			},/*
			tps_qiling:{
				audio:2,
				trigger:{player:'shaBegin'},
				check:function(event,player){
					return get.attitude(player,event.target)<0;
				},
				logTarget:'target',
				content:function(){
					"step 0"
					player.judge(function(){return 0});
					if(!trigger.target.hasSkill('fengyin')){
						trigger.target.addTempSkill('fengyin');
					}
					"step 1"
					var suit=get.suit(result.card);
					var target=trigger.target;
					var num=target.countCards('h','shan');
					target.chooseToDiscard('请弃置一张'+get.translation(suit)+'牌，否则不能使用答抵消此问','he',function(card){
						return get.suit(card)==_status.event.suit;
					}).set('ai',function(card){
						var num=_status.event.num;
						if(num==0) return 0;
						if(card.name=='shan') return num>1?2:0;
						return 8-get.value(card);
					}).set('num',num).set('suit',suit);
					"step 2"
					if(!result.bool){
						trigger.directHit=true;
						player.addTempSkill('tps_qiling1',{
							player: 'damageEnd'
						});
					}
				}
			},*/
			tps_qiling:{
				audio:2,
				trigger:{player:'shaBegin'},
				check:function(event,player){
					return get.attitude(player,event.target)<=0;
				},
				logTarget:'target',
				content:function(){
					"step 0"
					player.judge(function(card){
					    return 0;
					});
					"step 1"
					if(result.card.name=='sha'){
						trigger.directHit=true;
						player.addTempSkill('tps_qiling1',{
							player: 'damageEnd'
						});
					}
				}
			},
			tps_qiling1:{
				audio:true,
				trigger:{source:'damageBegin'},
				filter:function(event){
					if(event.parent.name=='_lianhuan'||event.parent.name=='_lianhuan2') return false;
					if(event.card&&event.card.name=='sha'){
						return true;
					}
					return false;
				},
				forced:true,
				content:function(){
					trigger.num++;
				},
				ai:{
					effect:{
						target:function(card,player,target,current){
							if(card.name=='sha'&&target.countCards('h')==0) return [1,-2];
						}
					}
				}
			},
			tps_longduan:{
			    audio: 2,
				unique: true,
				limited: true,
				skillAnimation: "epic",
				animationColor: "fire",
				enable:['chooseToUse','chooseToRespond'],
				filterCard:true,
				usable:1,
				filter:function(event,player){
				    if(player.storage.tps_longduan) return false;
				    return true;
				},
				check:function(card){
					return 9-get.value(card);
				},
				filterTarget:function(card,player,target){
					if(target.hp>=target.maxHp) return false;
					return true;
				},
				content:function(){
				    player.awakenSkill('tps_longduan');
					target.recover(target.maxHp-target.hp);
					target.draw((target.maxHp-target.hp)*2);
					player.storage.tps_longduan=true;
				},
				ai:{
				    save:true,
					order:9,
					result:{
						target:function(player,target){
							if(target.hp<1) return 5;
							//if(player==target&&player.countCards('h')>player.hp) return 5;
							return 2;
						}
					},
					threaten:2
				},
				mark: true,
				intro: {
					content: "limited",
				},
				init: function (player) {
					player.storage.tps_longduan=false;
				},
			},
			tps_huangpao: {
				audio: 2,
				trigger: {
					player: "phaseDrawBegin",
				},
				frequent: true,
				content: function () {
					trigger.num += 1;
				},
				ai: {
					threaten: 1.3,
				},
				group:['tps_huangpao1'],
			},
			tps_huangpao1: {
				mod: {
					maxHandcard: function (player, num) {
						return num + 3;
					},
				},
			},
			tps_jinji: {
				trigger: {
					player: "phaseBegin",
				},
				alter: true,
				forced: true,
				content: function () {
					if (!player.storage.tps_jinji_mark) {
						player.storage.tps_jinji_mark = 0;
					}
					player.storage.tps_jinji_mark += 1;
					if(player.storage.tps_jinji_mark %3 == 0){
					    player.recover();
					}
					player.syncStorage('tps_jinji_mark');
					player.markSkill('tps_jinji_mark');
				},
				global: ["tps_jinji_mark"],
				subSkill: {
					mark: {
						marktext: "进",
						intro: {
							content: "mark",
						},
						sub: true,
					},
				},
			},
			tps_guanlan:{
				audio:2,
				priority:-9,
				trigger:{source:'damageBegin'},
				filter:function(event){
					if(event.parent.name=='_lianhuan'||event.parent.name=='_lianhuan2') return false;
					return true;
				},
				check:function(event,player){
					return get.attitude(player,event.target)<=0;
				},
				logTarget:'target',
				content:function(){
					"step 0"
					player.judge(function(card){
					    if(get.suit(card)=='heart')return 2;
					    return -0.5;
					});
					"step 1"
					if(result.judge>0){
						trigger.num*=2;
					}
				}
			},
			tps_tujin:{
			    audio: 2,
				unique: true,
				limited: true,
				skillAnimation: "epic",
				animationColor: "fire",
				audio:true,
				trigger:{source:'dieAfter'},
				filter:function(event,player){
					if(player.storage.tps_tujin) return false;
					if(event.parent.name=='tps_tujin') return false;
				    return true;
				},
				content:function(){
				    'step 0'
				    player.chooseTarget(1,true,get.prompt('tps_tujin')).ai = function (target) {
						if (target.hasSkill('hongyan'))
							return 0;
						if (player.hp<=1)
						    return 0;
						return get.damageEffect(target, _status.event.player, _status.event.player,'fire');
					};
					'step 1'
					if(result.bool){
					    player.awakenSkill('tps_tujin');
					    //event.target = result.targets[0];
					    player.logSkill('tps_tujin', result.targets, 'fire');
					}else{
					    event.finish();
					    //return 0;
					}
					player.loseHp();
					console.log(result.targets[0].damage(2,'fire',player));
					//event.target.damage(2,'fire');
					player.storage.tps_tujin=true;
				},
				mark: true,
				intro: {
					content: "limited",
				},
				init: function (player) {
					player.storage.tps_tujin=false;
				},
			},
			tps_tuifei:{
				audio:2,
				priority:-11,
				forced:true,
				trigger:{player:'damageBegin'},
				filter:function(event,player){
				    if(!event.source)return false;
					if(player.hp<event.source.hp) return false;
				    return true;
				},
				content:function(){
					trigger.num*=2;
				}
			},
			tps_zuobie: {
				audio: 4,
				forbid: ["boss"],
				trigger: {
					player: "dieBefore",
				},/*
				usable:1,*//*
				filterTarget:function(card,player,target){
					return true;
				},*/
				filter: function (event) {
					return true;
				},/*
				content:function(){
					target.damage(2);
					target.loseMaxHp();
				},*/
				//forced:true,
				
				content: function () {
				    "step 0"
				    player.chooseTarget(get.prompt('tps_zuobie')).ai = function (target) {
						if (target.hasSkill('hongyan'))
							return 0;
						return get.damageEffect(target, _status.event.player, _status.event.player,2);
					};
					"step 1"
					if(result.bool){
					    trigger.target = result.targets[0];
					    trigger.target.loseHp(2);
					    trigger.target.loseMaxHp();
					    //
					}
				},
				logTarget: "source",
				ai: {
					threaten: function (player, target) {
						if (target.hp == 1)
							return 0.2;
						return 1.5;
					},
					effect: {
						target: function (card, player, target, current) {
							if (!target.hasFriend())
								return;
							if (target.hp <= 1 && get.tag(card, 'damage'))
								return [1, 0, 0, -2];
						},
					},
				},
			},
			tps_sunyou: {
				trigger: {
					global: "damageEnd",
					global: "phaseBegin",
					global: "useCardAfter",
					global: "phaseDraw",
					global: "phaseUse",
					global: "phaseEnd",
				},
				forced: true,
				audio: 2,
				content: function () {
				    if(!player.isLinked()){
				        player.link();
				    }
					trigger.current = player.next;
					
					while(trigger.current!=player){
					    if (trigger.current.sex=="male" && trigger.current.isLinked()){
					        trigger.current.animate('target');
				        	trigger.current.link();
				    	}
				    	if (trigger.current.sex=="female" && !trigger.current.isLinked()){
				    	    trigger.current.animate('target');
			    	    	trigger.current.link();
				    	}
						trigger.current = trigger.current.next;
						game.delay(0.5);
					}
				},
			},
			tps_fanren:{
				trigger:{global:'phaseBegin'},
				priority:5,
				audio:true,
				filter:function(event,player){
					if(player==_status.currentPhase) return false;
					return _status.currentPhase.countGainableCards(player,'hej')>0;
				},
				check:function(event,player){
					return (get.attitude(player,_status.currentPhase)<=0)||(get.attitude(player,_status.currentPhase)>0 && _status.currentPhase.countGainableCards(player,'j')>0);
				},
				content:function(){
					"step 0"
					player.chooseToDiscard(get.prompt('tps_fanren'),'he').set('ai',function(card){
						var trigger=_status.event.getTrigger();
						return 5-get.value(card);
					});;
					/*_status.currentPhase.chooseToDiscard('弃置一张手牌，或令'+get.translation(player)+'摸一张牌').set('ai',function(card){
						var trigger=_status.event.getTrigger();
						return -get.attitude(_status.currentPhase,player)-get.value(card);
					});*/
					"step 1"
					if(result.bool) {
					    if(_status.currentPhase.countGainableCards(player,'hej')){
					    	player.gainPlayerCard('hej',_status.currentPhase,true);
				    	}
					}
				}
			},
			tps_yixue:{
				enable:'phaseUse',
				filter:function(event,player){
					return !player.hasSkill('subplayer')&&player.getSubPlayers('tps_yixue_get').length>0;
				},
				nosub:true,
				group:'tps_yixue_get',
				direct:true,
				delay:0,
				skillAnimation:true,
				animationColor:'thunder',
				content:function(){
					player.callSubPlayer().set('tag','tps_yixue_get');
				},
				ai:{
					order:1,
					result:{
						player:function(player,target){
							return 1;
							// if(player.hp<=1) return 1;
							// if(!player.needsToDiscard(player.hp-1)) return 1;
							// return 0;
						}
					}
				},
				subSkill:{
					get:{
						trigger:{global:'dieAfter'},
						forced:true,
						filter:function(event,player){
							return !event.player.isMin()&&![player.name,player.name1,player.name2].contains(event.player.name);
						},
						content:function(){
							var skills=lib.character[trigger.player.name][3].slice(0);
							for(var i=0;i<skills.length;i++){
								if(lib.skill[skills[i]].nosub){
									skills.splice(i--,1);
								}
							}
							player.addSubPlayer({
								name:trigger.player.name,
								skills:skills,
								hs:get.cards(2),
								intro:'出牌阶段，你可以进入易学状态（易学状态被退学前不可再次切换）'
							});
						}
					}
				}
			},
			tps_zhuangruo:{
				trigger:{player:'dyingAfter'},
				forced:true,
				filter:function(event,player){
					return event.source&&event.source.isIn()&&event.source.hp>0;
				},
				logTarget:'source',
				content:function(){
					trigger.source.loseHp();
				},
				ai:{
					threaten:function(player,target){
						if(target.hp==1) return 0.6;
						return 1;
					},
					effect:{
						target:function(card,player,target,current){
							if(!target.hasFriend()) return;
							if(target.hp<=1&&get.tag(card,'damage')) return [1,0,0,-1];
						}
					}
				}
			},
			tps_nianmai: {
				audio: 2,
				trigger: {
					player: "dieBefore",
				},
				forced: true,
				filter: function (event, player) {
					return player.maxHp > 0 && player.hp <= 0
				},
				content: function () {
					"step 0"
					event.card = get.cards()[0];
					if (player.storage.tps_nianmai == undefined)
						player.storage.tps_nianmai = [];
					player.storage.tps_nianmai.push(event.card);
					player.syncStorage('tps_nianmai');
					player.showCards(player.storage.tps_nianmai, '青春')
					player.markSkill('tps_nianmai');
					"step 1"
					if (get.number(event.card) && get.number(event.card)-4 > game.countPlayer() )
						return;
					trigger.cancel();
					if (player.hp <= 0) {
						player.maxHp += 1;
						player.hp = player.maxHp;
						player.update();
					}
					if(player.storage.tps_nianmai.length > game.countPlayer()){
					    player.removeSkill('tps_nianmai');
					    player.hp = 1;
						player.maxHp = 1;
						player.update();
					}
				},
				intro: {
					content: "cards",
					onunmark: function (storage, player) {
						if (storage && storage.length) {
							player.$throw(storage);
							for (var i = 0; i < storage.length; i++) {
								storage[i].discard();
							}
							delete player.storage.tps_nianmai;
						}
					},
				},
			},
			tps_fafen: {
				skillAnimation: true,
				audio: 2,
				unique: true,
				priority: -10,
				derivation: ["tps_fuchu","tps_youxiu"],
				trigger: {
					player: "dyingAfter",
				},
				forced: true,
				filter: function (event, player) {
					if (player.storage.tps_fafen)
						return false;
					return true;
				},
				content: function () {
					"step 0"
					player.awakenSkill('tps_fafen');
					player.maxHp += 1;
					player.update();
					player.addSkill('tps_youxiu');
					player.addSkill('tps_fuchu');
				},
			},
			tps_fuchu: {
				skillAnimation: true,
				audio: 2,
				unique: true,
				priority: -10,
				derivation: ["tps_dengding","shensi"],
				trigger: {
					player: "dyingAfter",
				},
				forced: true,
				filter: function (event, player) {
					if (player.storage.tps_fuchu)
						return false;
					return true;
				},
				content: function () {
					"step 0"
					player.awakenSkill('tps_fuchu');
					player.addSkill('shensi');
					player.addSkill('tps_dengding');
					player.maxHp -= 1;
					player.hp = player.maxHp;
					player.update();
				},
			},
			tps_dengding: {
				skillAnimation: true,
				audio: 2,
				unique: true,
				priority: -10,
				derivation: "tps_fengkuang",
				trigger: {
					player: "dyingAfter",
				},
				forced: true,
				filter: function (event, player) {
					if (player.storage.tps_dengding)
						return false;
					return true;
				},
				content: function () {
					"step 0"
					player.awakenSkill('tps_dengding');
					player.addSkill('tps_fengkuang');
					player.insertPhase();
				},
			},
			tps_tiankeng: {
				trigger: {
					global: 'respond'
				},
				frequent:true,
				filter: function (event, player) {
					return ((event.card.name == 'shan')  && get.itemtype(event.card) == 'card');
				},
				content: function () {
					player.draw(1);
				}
			},
			tps_nanti:{
				audio:2,
				trigger:{player:'shaBegin'},
				filter: function (event, player) {
					return event.card.nature;
				},
				check:function(event,player){
					return get.attitude(player,event.target)<=0;
				},
				logTarget:'target',
				content:function(){
					"step 0"
					trigger.directHit=true;
				}
			},/*
			tps_bishen:{
				audio:2,
				mark:true,
				group:['tps_bishen2'],
				logTarget:'target',
				init:function(player){
					player.storage.tps_bishen_mark=3;
					player.markSkill('tps_bishen_mark');
					player.syncStorage('tps_bishen_mark');
				},
				trigger:{global:'damageBegin'},
				forced:true,
				filter:function(event,player){
				    if (!event.player.storage.tps_bishen_mark)return false;
				    //console.log(event);
					return event.player.storage.tps_bishen_mark>0; 
				},
				content:function(){
				    trigger.cancel();
					trigger.player.storage.tps_bishen_mark--;
					trigger.player.markSkill('tps_bishen_mark');
					trigger.player.syncStorage('tps_bishen_mark');
				},
				global: ["tps_bishen_mark"],
				subSkill: {
					mark: {
						marktext: "逼",
						intro: {
							content: "mark",
						},
						sub: true,
					},
				},
			},*/
			tps_xiaozhang: {
				trigger: {
					source: "damageBegin",
				},
				filter:function(event){
					if(event.parent.name=='_lianhuan'||event.parent.name=='_lianhuan2') return false;
					return true;
				},
				forced: true,
				audio: true,
				priority: -9,
				content: function () {
					if(trigger.nature && trigger.nature=="thunder"){
					    trigger.num*=3;
					}else{
					    trigger.nature="thunder";
					}
				},
			},
			tps_zongheng:{
				audio:2,
				trigger:{player:'loseEnd'},
				frequent:true,
				filter:function(event,player){
					if(player.countCards('h')) return false;
					for(var i=0;i<event.cards.length;i++){
						if(event.cards[i].original=='h') return true;
					}
					return false;
				},
				content:function(){
					"step 0"
					var targets=game.filterPlayer();
					targets.remove(player);
					targets.sort(lib.sort.seat);
					event.targets=targets;
					event.num=0;
					trigger.cancel();
					player.line(targets,'green');
					"step 1"
					if(num<event.targets.length){
						if(event.targets[num].countCards('hej')){
							player.gainPlayerCard(event.targets[num],'hej',true);
						}
						event.num++;
						event.redo();
					}
				},
				ai:{
					threaten:0.8,
					effect:{
						target:function(card){
							if(card.name=='guohe'||card.name=='liuxinghuoyu') return 0.5;
						}
					},
					noh:true,
					skillTagFilter:function(player,tag){
						if(tag=='noh'){
							if(player.countCards('h')!=1) return false;
						}
					}
				}
			},
			tps_dalue:{
				audio:2,
				unique: true,
				enable: "phaseUse",
				limited: true,
				skillAnimation: "epic",
				animationColor: "thunder",
				content:function(){
				    player.awakenSkill('tps_dalue');
					"step 0"
					var targets=game.filterPlayer();
					targets.remove(player);
					targets.sort(lib.sort.seat);
					event.targets=targets;
					event.num=0;
					player.line(targets,'green');
					"step 1"
					if(num<event.targets.length){
						if(event.targets[num].countCards('hej')){
							player.gainPlayerCard(event.targets[num],event.targets[num].countCards('hej'),'hej',true);
						}
						event.num++;
						event.redo();
					}
				},
				ai: {
					order: 10,
					result: {
						player: function (player) {
							if (lib.config.mode == 'identity' && game.zhu.isZhu && player.identity == 'fan') {
								if (game.zhu.hp == 1)
									return 1;
							}
							var num = 0;
							var players = game.filterPlayer();
							for (var i = 0; i < players.length; i++) {
								var att = get.attitude(player, players[i]);
								if (att > 0)
									att = 1;
								if (att < 0)
									att = -1;
								if (players[i] != player && players[i].hp <= 3) {
									if (players[i].countCards('h') == 0)
										num += att / players[i].hp;
									else if (players[i].countCards('h') == 1)
										num += att / 2 / players[i].hp;
									else if (players[i].countCards('h') == 2)
										num += att / 4 / players[i].hp;
								}
								if (players[i].hp == 1)
									num += att * 1.5;
							}
							if (player.hp == 1) {
								return  - num;
							}
							if (player.hp == 2) {
								return  - game.players.length / 4 - num;
							}
							return  - game.players.length / 3 - num;
						},
					},
				},
			},
			tps_yuben:{
				mod:{
					globalTo:function(from,to,current){
						return current-1;
					},
					globalFrom:function(from,to,current){
						return current+1;
					},
				},
				ai:{
					threaten:0.8
				}
			},
			tps_guaili:{
				audio:1,
				filter:function(event,player){
					return player.countCards('he')>0;
				},
				enable:'chooseToUse',
				filterCard:function(card){
					return true;
				},
				position:'he',
				viewAs:{name:'juedou'},
				prompt:'将一张牌当辩论使用',
				check:function(card){return 6-get.value(card)},
				ai:{
					threaten:1.5
				}
			},
			tps_xiabi:{
			    group:['tps_xiabi2'],
			    init:function(player){
					player.storage.tps_xiabi=0;
				},
                mark:true,
                intro:{
					mark:function(dialog,content,player){
						return '本回合已发动'+player.storage.tps_xiabi+'次“瞎逼”技能';
					},
				},
				enable:'phaseUse',
				audio:2,
				filter:function(event,player){
					return player.countCards('h')>0
				},
				chooseButton:{
					dialog:function(){
						var list=['sha','tao','jiu','taoyuan','wugu','juedou','huogong','jiedao','tiesuo','guohe','shunshou','wuzhong','wanjian','nanman'];
						for(var i=0;i<list.length;i++){
							if(i<3){
								list[i]=['基本','',list[i]];
							}
							else{
								list[i]=['动作','',list[i]];
							}
						}
						return ui.create.dialog([list,'vcard']);
					},
					filter:function(button,player){
						return lib.filter.filterCard({name:button.link[2]},player,_status.event.getParent());
					},
					check:function(button){
						var player=_status.event.player;
						if(player.countCards('h','wuzhong')){
							if(player.hp==1&&player.countCards('h','tao')){
								return button.link=='tao'?1:0;
							}
							return button.link=='wuzhong'?1:0;
						}
						if(player.hp<player.maxHp){
							if(player.countCards('h','tao')){
								return button.link=='tao'?1:0;
							}
						}
					},
					backup:function(links,player){
						return {
							filterCard:true,
							selectCard:++player.storage.tps_xiabi,
							audio:2,
							popname:true,
							viewAs:{name:links[0][2]},
						}
					},
					prompt:function(links,player){
						return '将'+(player.storage.tps_xiabi)+'张手牌当'+get.translation(links[0][2])+'使用';
					}
				},
				ai:{
					order:1,
					result:{
						player:function(player){
							var num=0;
							var cards=player.getCards('h');
							if(cards.length>=3&&player.hp>=3) return 0;
							for(var i=0;i<cards.length;i++){
								num+=Math.max(0,get.value(cards[i],player,'raw'));
							}
							num/=cards.length;
							num*=Math.min(cards.length,player.hp);
							return 12-num;
						}
					},
					threaten:1.6,
				}
			},
			tps_xiabi2:{
			    audio:2,
			    forced:true,
			    trigger:{player:'phaseEnd'},
			    content:function(){
			        player.storage.tps_xiabi=0;
			        player.syncStorage('tps_xiabi');
			    }
			},
			tps_qingui:{
				group:['tps_qingui1'],
				audio:2,
				trigger:{player:'damageEnd'},
				filter:function(event,player){
					return event.num>=2 && !player.isTurnedOver();
				},
				check:function(event,player){return player.maxHp-player.countCards('h')-3},
				content:function(){
					"step 0"
					player.draw(player.maxHp-player.countCards('h'));
					player.turnOver();
				},
				ai:{
					maixie:true,
					maixie_hp:true
				}
			},
			tps_qingui1:{
				audio:2,
				trigger:{player:'loseHpEnd'},
				filter:function(event,player){
					return !player.isTurnedOver();
				},
				check:function(event,player){return player.maxHp-player.countCards('h')-3},
				content:function(){
					"step 0"
					player.draw(player.maxHp-player.countCards('h'));
					player.turnOver();
				}
			},
			tps_cuimian:{
				audio:2,
				enable:'phaseUse',
				filterCard:true,
				usable:1,
				selectCard:2,
				check:function(card){
					var player=get.owner(card);
					if(player.countCards('h')>player.hp)
						return 8-get.value(card)
					return 4-get.value(card)
				},
				filterTarget:function(card,player,target){
					if(target==player) return false;
					if(target.hasSkill('tps_cuimian2')) return false;
					return true;
				},
				content:function(){
					target.turnOver();
					target.addTempSkill('tps_cuimian2', {
							player: 'phaseBegin'
						});
				},
				ai:{
					order:5.5,
					result:{
						player:function(player){
							if(player.countCards('h')>player.hp) return 2;
							return -1;
						},
						target:function(player,target){
							if(target.hasSkillTag('noturn')) return 0;
							if(get.attitude(player,target)==0) return 0;
							if(get.attitude(player,target)>0){
								if(target.classList.contains('turnedover')) return 1000;
								return -1000;
							}
							else{
								if(target.classList.contains('turnedover')) return -10;
								return 10;
							}
						}
					},
					threaten:2,
				}
			},
			tps_cuimian2:{
				mark:true,
				intro:{
					content:'直到你的回合开始时，你不能成为“催眠”的目标'
				}
            },
            //retps.js---------------------------
            //-----------------------------------
            //-----------------------------------
            
		    tps_lumang: {
				audio: true,
				forced: true,
				trigger: {
					player: "phaseBegin",
				},
				content: function () {
					"step 0"
					player.judge(function (card) {
						if (get.color(card) == 'red')
							return 1.5;
						return -1.5;
					}, ui.special);
					"step 1"
					if (result.judge > 0) {
						player.addTempSkill('tps_lumang1', {
							player: 'phaseAfter'
						});
					} else {
						player.addTempSkill('tps_lumang2', {
							player: 'phaseBegin'
						});
						player.addTempSkill('tps_lumang3', {
							player: 'phaseBegin'
						});
					}
					event.finish();
				},
			},
			tps_lumang1: {
			    group:['tps_lumang4','tps_lumang5'],
				mod: {
					targetInRange: function (card, player, target, now) {
						if (card.name == 'sha' && get.color(card) == 'red')
							return true;
					},
					cardUsable: function (card, player, num) {
						if (card.name == 'sha')
							return num + 1;
					}
				},
				trigger: {
					player: 'shaBegin'
				},
				forced: true,
				filter: function (event, player) {
					return event.card && get.color(event.card) == 'red';
				},
				content: function () {
					trigger.directHit = true;
				}
			},
			tps_lumang2: {
				mod: {
					cardEnabled: function (card, player) {
						if (_status.event.skill != 'tps_lumang2' && card.name != 'sha' && get.color(card) == 'black')
							return false;
					},
					cardUsable: function (card, player) {
						if (_status.event.skill != 'tps_lumang2' && card.name != 'sha' && get.color(card) == 'black')
							return false;
					},
					cardRespondable: function (card, player) {
						if (_status.event.skill != 'tps_lumang2' && card.name != 'sha' && get.color(card) == 'black')
							return false;
					},
					cardSavable: function (card, player) {
						if (_status.event.skill != 'tps_lumang2' && card.name != 'sha' && get.color(card) == 'black')
							return false;
					},
				},
				audio: 2,
				enable: ["chooseToUse", "chooseToRespond"],
				filterCard: {
					color: "black",
				},
				viewAs: {
					name: "sha",
				},
				check: function () {
					return 1
				},
				ai: {
					effect: {
						target: function (card, player, target, current) {
							if (get.tag(card, 'respondSha') && current < 0)
								return 0.6
						},
					},
					respondSha: true,
					order: 4,
					useful: -1,
					value: -1,
					basic: {
						useful: [5, 1],
						value: [5, 1],
					},
					result: {
						target: function (player, target) {
							if (player.hasSkill('jiu') && !target.getEquip('baiyin')) {
								if (get.attitude(player, target) > 0) {
									return -6;
								} else {
									return -3;
								}
							}
							return -1.5;
						},
					},
					tag: {
						respond: 1,
						respondShan: 1,
						damage: function (card) {
							if (card.nature == 'poison')
								return;
							return 1;
						},
						natureDamage: function (card) {
							if (card.nature)
								return 1;
						},
						fireDamage: function (card, nature) {
							if (card.nature == 'fire')
								return 1;
						},
						thunderDamage: function (card, nature) {
							if (card.nature == 'thunder')
								return 1;
						},
						poisonDamage: function (card, nature) {
							if (card.nature == 'poison')
								return 1;
						},
					},
				},
			},
			tps_lumang3: {
				mod: {
					cardEnabled: function (card, player) {
						if (_status.event.skill != 'tps_lumang3' && card.name != 'shan' && get.color(card) == 'red')
							return false;
					},
					cardUsable: function (card, player) {
						if (_status.event.skill != 'tps_lumang3' && card.name != 'shan' && get.color(card) == 'red')
							return false;
					},
					cardRespondable: function (card, player) {
						if (_status.event.skill != 'tps_lumang3' && card.name != 'shan' && get.color(card) == 'red')
							return false;
					},
					cardSavable: function (card, player) {
						if (_status.event.skill != 'tps_lumang3' && card.name != 'shan' && get.color(card) == 'red')
							return false;
					},
				},
				audio: 2,
				enable: ["chooseToUse", "chooseToRespond"],
				filterCard: function (card) {
					return get.color(card) == 'red';
				},
				viewAs: {
					name: "shan",
				},
				viewAsFilter: function (player) {
					if (!player.countCards('h', {
							color: 'red'
						}))
						return false;
				},
				check: function () {
					return 1;
				},
				ai: {
					effect: {
						target: function (card, player, target, current) {
							if (get.tag(card, 'respondShan') && current < 0)
								return 0.6
						},
					},
					respondShan: true,
					order: 4,
					useful: -1,
					value: -1,
					basic: {
						useful: [5, 1],
						value: [5, 1],
					},
					result: {
						target: function (player, target) {
							return -1.5;
						},
					},
					tag: {
						respond: 1,
						respondShan: 1,
						damage: function (card) {
							if (card.nature == 'poison')
								return;
							return 1;
						},
						natureDamage: function (card) {
							if (card.nature)
								return 1;
						},
						fireDamage: function (card, nature) {
							if (card.nature == 'fire')
								return 1;
						},
						thunderDamage: function (card, nature) {
							if (card.nature == 'thunder')
								return 1;
						},
						poisonDamage: function (card, nature) {
							if (card.nature == 'poison')
								return 1;
						},
					},
				},
			},
			tps_lumang4:{
				audio:1,
				filter:function(event,player){
					return player.countCards('he',{color:'red'})>0;
				},
				enable:'chooseToUse',
				filterCard:function(card){
					return get.color(card)=='red';
				},
				position:'he',
				viewAs:{name:'shan'},
				prompt:'将一张文科牌当答使用',
				check:function(card){return 6-get.value(card)},
				ai:{
					threaten:1.5
				}
			},
			tps_lumang5:{
				audio:1,
				filter:function(event,player){
					return player.countCards('he',{color:'red'})>0;
				},
				enable:'chooseToUse',
				filterCard:function(card){
					return get.color(card)=='red';
				},
				position:'he',
				viewAs:{name:'sha'},
				prompt:'将一张理科牌当问使用',
				check:function(card){return 6-get.value(card)},
				ai:{
					threaten:1.5
				}
			},
			tps_baofa: {
				group: ["tps_baofa1", "tps_baofa2", "tps_baofa3", "tps_baofa4"],
				ai: {
					skillTagFilter: function (player, tag) {
						switch (tag) {
						case 'respondSha': {
								if (player.countCards('he') < Math.max(1, player.hp))
									return false;
								break;
							}
						case 'respondShan': {
								if (player.countCards('he') < Math.max(1, player.hp))
									return false;
								break;
							}
						case 'save': {
								if (player.countCards('he') < Math.max(1, player.hp))
									return false;
								break;
							}
						}
					},
					maixie: true,
					save: true,
					respondSha: true,
					respondShan: true,
					effect: {
						target: function (card, player, target) {
							if (get.tag(card, 'recover') && target.hp >= 1)
								return [0, 0];
							if (!target.hasFriend())
								return;
							if ((get.tag(card, 'damage') == 1 || get.tag(card, 'loseHp')) && target.hp > 1)
								return [0, 1];
						},
					},
					threaten: function (player, target) {
						if (target.hp == 1)
							return 2;
						return 0.5;
					},
				},
			},
			tps_baofa1:{
				audio:true,
				enable:['chooseToUse','chooseToRespond'],
				prompt:function(){
					return '将'+get.cnNumber(Math.max(1,_status.event.player.hp))+'张牌当作习使用';
				},
				position:'he',
				check:function(card,event){
					if(_status.event.player.hp>1) return 0;
					return 10-get.value(card);
				},
				selectCard:function(){
					return Math.max(1,_status.event.player.hp);
				},
				viewAs:{name:'tao'},
				filter:function(event,player){
					return player.countCards('he')>=player.hp;
				},
				filterCard:function(card){
					return true;
				}
			},
			tps_baofa2:{
				audio:true,
				enable:['chooseToUse','chooseToRespond'],
				prompt:function(){
					return '将'+get.cnNumber(Math.max(1,_status.event.player.hp))+'张牌当作年级问使用或打出';
				},
				position:'he',
				check:function(card,event){
					if(_status.event.player.hp>1) return 0;
					return 10-get.value(card);
				},
				selectCard:function(){
					return Math.max(1,_status.event.player.hp);
				},
				viewAs:{name:'sha',nature:'fire'},
				filter:function(event,player){
					return player.countCards('he')>=player.hp;
				},
				filterCard:function(card){
					return true;
				}
			},
			tps_baofa3:{
				audio:true,
				enable:['chooseToUse','chooseToRespond'],
				prompt:function(){
					return '将'+get.cnNumber(Math.max(1,_status.event.player.hp))+'张牌当作我很优秀使用';
				},
				position:'he',
				check:function(card,event){
					if(_status.event.player.hp>1) return 0;
					return 7-get.value(card);
				},
				selectCard:function(){
					return Math.max(1,_status.event.player.hp);
				},
				viewAs:{name:'wuxie'},
				viewAsFilter:function(player){
					return player.countCards('he')>=player.hp;
				},
				filterCard:function(card){
					return true;
				}
			},
			tps_baofa4:{
				audio:true,
				enable:['chooseToUse','chooseToRespond'],
				prompt:function(){
					return '将'+get.cnNumber(Math.max(1,_status.event.player.hp))+'张当作答打出';
				},
				position:'he',
				check:function(card,event){
					if(_status.event.player.hp>1) return 0;
					return 10-get.value(card);
				},
				selectCard:function(){
					return Math.max(1,_status.event.player.hp);
				},
				viewAs:{name:'shan'},
				filterCard:function(card){
					return true;
				}
			},
			tps_nixue:{
				unique:true,
				trigger:{player:'damageEnd',global:'gameStart'},
				direct:true,
				init:function(player){
					player.storage.tps_nixue=[];
					// player.storage.tps_nixue2=0;
				},
				intro:{
					content:'characters'
				},
				content:function(){
					'step 0'
					event.num=trigger.num;
					// if(player.storage.tps_nixue2<1){
					// 	player.storage.tps_nixue2++;
					// 	event.finish();
					// }
					// else{
					// 	player.storage.tps_nixue2=0;
					// }
					'step 1'
					player.logSkill('tps_nixue');
					var list=[];
					var list2=[];
					var players=game.players.concat(game.dead);
					for(var i=0;i<players.length;i++){
						list2.add(players[i].name);
						list2.add(players[i].name1);
						list2.add(players[i].name2);
					}
					for(var i in lib.character){
						if(lib.character[i][4].contains('boss')) continue;
						if(lib.character[i][4].contains('minskin')) continue;
						if(player.storage.tps_nixue.contains(i)) continue;
						if(list2.contains(i)) continue;
						list.push(i);
					}
					var name=list.randomGet();
					player.storage.tps_nixue.push(name);
					player.markSkill('tps_nixue');
					var skills=lib.character[name][3];
					for(var i=0;i<skills.length;i++){
						player.addSkill(skills[i]);
					}
					event.dialog=ui.create.dialog('<div class="text center">'+get.translation(player)+'发动了【逆学】',[[name],'character']);
					game.delay(2);
					'step 2'
					event.dialog.close();
					event.num--;
					if(event.num>0){
					    event.goto(1);
					}
				}
			},/*
			tps_jiexin: {
				audio: 2,
				trigger: {
					global: "phaseDrawBegin",
				},
				init:function(player){
					player.changeHujia(3);
				},
				forced: true,
				filter:function(event){
					return _status.currentPhase.hujia>0; 
				},
				content: function () {
					trigger.num += 1;
				},
				ai: {
					threaten: 1.3,
				},
			},
			tps_jiesi:{
				audio:true,
				enable:'phaseUse',
				filterTarget:function(card,player,target){
					return target!=player;
				},
				content:function(){
				    'step 0'
				    if(player.hujia && player.hujia>0){
				        player.chooseControl('失去1个护甲','失去1点分数').ai=function(event,player){
					    	//if(player.storage.tps_jiexin>1) return 'tps_jiexin_mark';
				    		//if(player.hp<player.maxHp-1||player.hp<=2) return 'baonue_maxHp';
			    			return '失去1点分数';
		    			};
				    }
		    	    'step 1'
		    	    //game.log(result.control);
		    		if(!player.hujia || player.hujia==0 || result.control=='失去1点分数'){
		    			   player.loseHp();
		    		}else{
		    		    player.changeHujia(-1);
		    		}
		    		//console.log(result);
		   			target.changeHujia(1);
				},
				ai:{
					order:5.5,
					result:{
						player:function(player){
							if(player.hp<3) return -4;
							if(player.hujia>1) return 2;
							//if(player.countCards('e')>1) return 1;
							return 0;
						},
						target:3
					},
					threaten:2,
				}
			},
			tps_zhuangbi: {
				audio: 2,
				trigger: {
					player: "phaseDrawBegin",
				},
				filter:function(event,player){
				    //console.log(event);
					return event.player.hujia==0; 
				},
				content: function () {
					trigger.cancel();
		            player.changeHujia(1);
				},
				ai: {
					threaten: 1.3,
				},
			},*/
			"tps_jiexin": {
                marktext: "洁",
                init: function(player) {
                    player.storage.tps_jiexin = 0;
                },
                intro: {
                    content: function(storage) {
                        return '当前有' + storage + '个“洁”';
                    },
                },
                mark: true,
                audio: 2,
                trigger: {
                    global: 'gameStart'
                },
                forced: true,
                content: function() {
                    player.storage.tps_jiexin += 3;
                    player.syncStorage('tps_jiexin');
                    game.log(player, '获得了3个“洁”');
                },
            },
            "_tps_jiexin": {
                audio: 2,
                trigger: {
                    player: 'damageBefore'
                },
                forced: true,
                filter: function(event, player) {
                    return player.storage.tps_jiexin > 0;
                },
                content: function() {
                    trigger.cancel();
                    player.storage.tps_jiexin--;
                    player.syncStorage('tps_jiexin');
                    if (player.storage.tps_jiexin <= 0) player.unmarkSkill('tps_jiexin');
                    game.log(player, '移去了1个“洁”');
                },
            },
            "_tps_jiexin1": {
                audio: 2,
                trigger: {
                    player: 'phaseDrawBegin'
                },
                forced: true,
                filter: function(event, player) {
                    return player.storage.tps_jiexin > 0;
                },
                content: function() {
                    trigger.num++;
                },
            },
            "tps_jiesi": {
                audio: 2,
                enable:'phaseUse',
                content: function() {
                    'step 0'
                    player.chooseTarget(get.prompt('tps_jiesi'), function(card, player, target) {
                        return target != player
                    }).ai = function(target) {
                        if (player.storage.tps_jiexin > 1) return get.attitude(player, target);
                        return -1;
                    };
                    'step 1'
                    if (result.bool) {
                        event.target = result.targets[0];
                        var list = ['失去一点分数'];
                        if (player.storage.tps_jiexin > 0) list.push('移去一个“洁”');
                        player.chooseControl(list).set('ai', function() {
                            if (player.storage.tps_jiexin > 0) return '移去一个“洁”';
                            return '失去一点分数';
                        });
                    } else {
                        event.finish();
                    };
                    'step 2'
                    if (result.control == '移去一个“洁”') {
                        player.storage.tps_jiexin--;
                        player.syncStorage('tps_jiexin');
                        if (player.storage.tps_jiexin <= 0) player.unmarkSkill('tps_jiexin');
                        game.log(player, '移去了1个“洁”');
                    } else {
                        player.loseHp();
                    };
                    player.line(event.target);
                    player.logSkill('tps_jiexin');
                    if (event.target.storage.tps_jiexin == undefined) event.target.storage.tps_jiexin = 0;
                    event.target.markSkill('tps_jiexin');
                    event.target.storage.tps_jiexin++;
                    event.target.syncStorage('tps_jiexin');
                    game.log(event.target, '获得了1个“洁”');
                },
            },
            "tps_liuji": {
                audio: 2,
                trigger: {
                    player: 'phaseDrawBefore'
                },
                filter: function(event, player) {
                    return player.storage.tps_jiexin == undefined || player.storage.tps_jiexin == 0;
                },
                check: function(event, player) {
                    return player.countCards('h') >= 2 || player.skipList.contains('phaseUse');
                },
                content: function() {
                    trigger.cancel();
                    if (player.storage.tps_jiexin == undefined) player.storage.tps_jiexin = 0;
                    player.markSkill('tps_jiexin');
                    player.storage.tps_jiexin++;
                    player.syncStorage('tps_jiexin');
                    game.log(player, '获得了1个“洁”');
                },
            },
			tps_zuobishen:{
				mod:{
					maxHandcard:function(player,num){
						return 2+num;
					}
				},
				audio:true,
				trigger:{player:'phaseDrawBegin'},
				priority:-5,
				filter:function(event,player){
					return player.hp<player.maxHp;
				},
				forced:true,
				content:function(){
					trigger.num=2+player.maxHp-player.hp;
				}
			},
			tps_re_bufa:{
			    group:['tps_re_bufa1','tps_re_bufa2'],
				trigger:{global:'damageBefore'},
				forced:true,
				filter:function(event,player){
					return (event.card&&(event.card.name=='shandian' || event.card.viewAs=='shandian' || event.card.name=='fulei' || event.card.viewAs=='fulei'));
				},
				content:function(){
					trigger.source=player;
				}
			},
			tps_re_bufa1:{
				trigger:{global:'damageEnd'},
				forced:true,
				filter:function(event,player){
					return (event.card&&(event.card.name=='shandian' || event.card.viewAs=='shandian' || event.card.name=='fulei' || event.card.viewAs=='fulei'));
				},
				content:function(){
					player.draw(trigger.num);
				}
			},
			tps_re_bufa2:{
				audio:2,
				trigger:{global:'judgeEnd'},
				forced:true,
				filter:function(event,player){
				    //console.log(event);
					return (event.card&&(event.card.name=='shandian' || event.card.viewAs=='shandian' || event.card.name=='fulei' || event.card.viewAs=='fulei'));
				},
				content:function(){
					player.draw();
					player.chooseToDiscard('he',true);
				}
			},
            tps_langxing:{
                init:function(player){
					player.storage.tps_langxing=false;
				},
                mark:true,
                intro:{
					mark:function(dialog,content,player){
						if(player.storage.tps_langxing) return '转换技状态：<strong>阳</strong>';
						return '转换技状态：<strong>阴</strong>';
					},
				},
				audio:1,
				enable:'phaseUse',
				usable:1,
				discard:false,
				filter:function(event,player){
					return player.countCards('he',{suit:'club'})>0;
				},
				prepare:'throw',
				position:'he',
				filterCard:{suit:'club'},
				filterTarget:function(card,player,target){
					if(player==target) return false;
					if(player.storage.tps_langxing){
					    if(target.hasJudge('fulei')) return false;
					    return lib.filter.targetEnabled({name:'fulei'},target,target);
					}else{
					    if(target.hasJudge('shandian')) return false;
				    	return lib.filter.targetEnabled({name:'shandian'},target,target);
					}
				},
				check:function(card){
					return 7-get.value(card);
				},
				content:function(){
					if(player.storage.tps_langxing){
						var next=target.useCard({name:'fulei'},target,cards);
						next.animate=false;
						next.audio=false;
					}
					else{
						var next=target.useCard({name:'shandian'},target,cards);
						next.animate=false;
						next.audio=false;
					}
					player.storage.tps_langxing=!player.storage.tps_langxing;
				},
				ai:{
					result:{
						target:function(player,target){
						    if(player.storage.tps_langxing){
							    if (get.attitude(player,target)){
							        return get.effect(target,{name:'fulei'},target,target);
							    }else{
							        return -get.effect(target,{name:'fulei'},target,target);
							    }
						    }else{
						        if (get.attitude(player,target)){
							        return get.effect(target,{name:'shandian'},target,target);
							    }else{
							        return -get.effect(target,{name:'shandian'},target,target);
							    }
						    }
						}
					},
					order:9,
				}
            },
            tps_guoren:{
				audio:2,
				trigger:{global:'gameDrawAfter'},
				forced:true,
				unique:true,
				content:function(){
					for(var i=0;i<game.players.length;i++){
						if(game.players[i]==player) continue;
						player.maxHp+=game.players[i].maxHp;
						//if(player.maxHp<game.players[i].maxHp)player.maxHp=game.players[i].maxHp;
						if(!game.players[i].name||!lib.character[game.players[i].name]) continue;
						var skills=lib.character[game.players[i].name][3];
						for(var j=0;j<skills.length;j++){
							if(!lib.skill[skills[j]].forceunique){
								player.addSkill(skills[j]);
							}
						}
					}
					player.maxHp=Math.ceil(player.maxHp/game.players.length)-1;
					player.hp=player.maxHp;
					player.update();
				},
				//group:['huanhua3','huanhua4'],
				ai:{
					threaten:0.8,
				}
			},
			tps_lianzhi: {
                audio: 2,
                trigger: {
                    player: 'phaseJudgeBefore'
                },
                filter: function(event, player) {
                    return true;
                },
				forced:true,
                content: function() {
                    trigger.cancel();
                }
            },
            tps_re_jingxin: {
                audio: 2,
                trigger: {
                    player: ['recoverAfter','damageEnd','loseHpEnd']
                },
                filter: function(event, player) {
                    return event.num > 0;
                },
                content: function() {
                    "step 0"
                    player.moveCard();
                    player.draw();
                },
                ai: {
                    expose: 0.2
                }
            },
			tps_re_qianshui: {
			    group:['tps_re_qianshui1'],
				audio: 2,
				unique: true,
				trigger: {
					player: 'damageBegin'
				},
				limited: true,
				forced:true,
				filter:function(event,player){
				    if(player.storage.tps_re_qianshui) return false;
				    return true;
				},
				content: function () {
				    trigger.cancel();
					player.storage.tps_re_qianshui=true;
				},
				mark: true,
				intro: {
					content: "limited",
				},
				init: function (player) {
					player.storage.tps_re_qianshui=false;
				},
			},
			tps_re_qianshui1: {
				audio: 2,
				trigger: {
					player: 'damageBegin'
				},
				forced:true,
				filter: function (event, player) {
					if(!player.storage.tps_re_qianshui) return false;
					if(!(event.num>0)) return false;
					if(!event.nature) return false;
				    return true;
				},
				content: function () {
					if(trigger.nature=="thunder"){
					    trigger.num*=2;
					}else if(trigger.nature=="fire"){
					    trigger.cancel();
					}
				},
				ai: {
					expose: 0.4
				}
			},
			tps_tuoqiao:{
				skillAnimation:true,
				audio:2,
				unique:true,
				derivation:['tps_xiujia'],
				trigger:{player:'damageBegin'},
				forced:true,
				filter:function(event,player){
					if(player.storage.tps_tuoqiao) return false;
					if(player.hp<player.maxHp && event.nature=="thunder") return false;
					return false;
				},
				content:function(){
				    player.awakenSkill('tps_tuoqiao');
					player.storage.tps_tuoqiao=true;
					trigger.cancel();
					player.loseMaxHp();
					target.removeSkill('tps_re_qianshui');
					player.addSkill('tps_xiujia');
				}
			},
			tps_xiujia: {
				audio: 2,
				enable: "phaseUse",
				filterCard: function (card) {
					return get.name(card)=="shan"
				},
				check: function (card) {
					return 5 - get.value(card)
				},
				content: function () {
					player.changeHujia(1);
				},
				ai: {
					order: 9,
					result: {
						player:4,
					},
					threaten: 2,
				},
			},
			tps_re_caiyi: {
				audio: 2,
				trigger: {
					player: "respond",
				},
				filter: function (event, player) {
					return event.card.name == 'shan';
				},
				direct: true,
				content: function () {
					"step 0";
					player.chooseTarget(get.prompt('tps_re_caiyi'),[1,2]).ai = function (target) {
						console.log(target);
						if (target.hasSkill('hongyan'))
							return 0;
						return get.damageEffect(target, _status.event.player, _status.event.player);
					};
					"step 1"
					if (result.bool) {
						player.logSkill('tps_re_caiyi', result.targets, 'thunder');
						event.target = result.targets;
					} else {
						event.finish();
					}
					"step 2"
					
                    var next = player.useCard({
						name: 'sha'
					}, event.target, cards);
					next.animate = false;
					next.audio = false;
                    return 0;
				},
				ai: {
					useShan: true,
					effect: {
						target: function (card, player, target, current) {
							if (get.tag(card, 'respondShan')) {
								var hastarget = game.hasPlayer(function (current) {
										return get.attitude(target, current) < 0;
									});
								var be = target.countCards('e', {
										color: 'black'
									});
								if (target.countCards('h', 'shan') && be) {
									if (!target.hasSkill('tps_wulai'))
										return 0;
									return [0, hastarget ? target.countCards('he') / 2 : 0];
								}
								if (target.countCards('h', 'shan') && target.countCards('h') > 2) {
									if (!target.hasSkill('tps_wulai'))
										return 0;
									return [0, hastarget ? target.countCards('h') / 4 : 0];
								}
								if (target.countCards('h') > 3 || (be && target.countCards('h') >= 2)) {
									return [0, 0];
								}
								if (target.countCards('h') == 0) {
									return [1.5, 0];
								}
								if (target.countCards('h') == 1 && !be) {
									return [1.2, 0];
								}
								if (!target.hasSkill('tps_wulai'))
									return [1, 0.05];
								return [1, Math.min(0.5, (target.countCards('h') + be) / 4)];
							}
						},
					},
				},
			},
			tps_re_shangjin: {
				audio: 2,
				unique: true,
				enable: "phaseUse",
				limited: true,
				skillAnimation: "epic",
				animationColor: "thunder",
				content: function () {
					"step 0"
					player.awakenSkill('tps_re_shangjin');
					"step 1"
					if(!player.storage.tps_siren ||player.storage.tps_siren == undefined)return;
					player.storage.discard(player.storage.tps_siren);
					game.addVideo('throw',player,['tps_re_shangjin',get.cardsInfo(player.storage.tps_siren),'cards']);
					delete player.storage.tps_siren;
				},
				ai: {
					order: 1,
					result: {
						player: function (player) {
						    if(!player.storage.tps_siren || player.storage.tps_siren == undefined)return -1;
							return player.storage.tps_siren.length-5;
						},
					},
				},
			},
			tps_shushen:{
				audio:2,
				trigger:{source:'damageBefore',player:'damageBefore'},
				priority:15,
				check:function(event,player){
					if(player==event.player) return true;
					return -(get.attitude(player,event.player));
				},
				filter:function(event,player){
					return get.type(event.card,'trick')=='trick';
				},
				content:function(){
					trigger.cancel();
				},
				ai:{
					notrick:true,
					notricksource:true,
					effect:{
						target:function(card,player,target,current){
							if(get.type(card)=='trick'&&get.tag(card,'damage')&&get.attitude(player,target)<0){
								return 0;
							}
						},
						player:function(card,player,target,current){
							if(get.type(card)=='trick'&&get.tag(card,'damage')&&get.attitude(current,player)<0){
								return 0;
							}
						}
					}
				}
			},
			tps_pianwen: {
				forced:true,
				mod: {
					suit: function (card, suit) {
						if (suit == 'diamond')
							return 'heart';
					},
				},
			},
			tps_re_wencai: {
                trigger: {
                    global: 'useCardAfter'
                },
                frequest:true,
                filter: function(event, player) {
                    return (event.card.suit == 'heart' && _status.currentPhase==player);
                },
                content: function() {
                    player.draw();
                }
            },
            tps_sijin:{
				audio:2,
				trigger:{target:'useCardToBegin'},
				priority:5,
				filter:function(event,player){
					if(event.name=='judge') return false;
					if(!event.targets||event.targets.length<2) return false;
					//if(event.targets.indexOf(player)) return true;
					if(event.card&&get.type(event.card)=='trick'&&event.player!=player) return true;
				},
				direct:true,
				frequest:true,
				content:function(){
					"step 0"
					trigger.targets.remove(player);
					player.draw();
				},
				intro:{
					content:'limited'
				}
			},
			tps_zeyou: {
				trigger: {
					global: "phaseEnd",
				},
				forced: true,
				audio: 2,
				content: function () {
					trigger.current = player.next;
					if(!player.isLinked() && player.sex=="female"){
				        player.link();
				        player.draw();
				    }
				    if(player.isLinked() && player.sex=="male"){
				        player.link();
				        trigger.current.chooseToDiscard('he', true);
				    }
					while(trigger.current!=player){
					    if (trigger.current.sex=="male" && trigger.current.isLinked()){
					        trigger.current.animate('target');
				        	trigger.current.link();
				        	trigger.current.chooseToDiscard('he', true);
				    	}
				    	if (trigger.current.sex=="female" && !trigger.current.isLinked()){
				    	    trigger.current.animate('target');
			    	    	trigger.current.link();
			    	    	trigger.current.draw();
				    	}
						trigger.current = trigger.current.next;
						game.delay(0.5);
					}
				},
			},
            tps_bihu: {
                audio: 2,
                trigger: {
                    target: 'useCardToBefore'
                },
                forced: true,
                filter: function(event, player) {
                    //if(event.)
                    //console.log(event);
                    return get.color(event.card) == 'black';
                },
                content: function() {
                    "step 0"
                    var eff = get.effect(player, trigger.card, trigger.player, trigger.player);
                    trigger.player.chooseToDiscard('庇护：弃置一张文科牌，否则'+get.translation(trigger.card)+'对' + get.translation(player) + '无效', function(card) {
                        return get.color(card) == 'red';
                    }).set('ai', function(card) {
                        if (_status.event.eff > 0) {
                            return 10 - get.value(card);
                        }
                        return 0;
                    }).set('eff', eff);
                    "step 1"
                    if (result.bool == false) {
                        trigger.cancel();
                    }
                },
                ai: {
                    effect: {
                        target: function(card, player, target, current) {
                            if (get.color(card) == 'black' && get.attitude(player, target) < 0) {
                                if (_status.event.name == 'tps_bihu') return;
                                var bs = player.getCards('h', {
                                    color: 'red'
                                });
                                if (bs.length < 2) return 0;
                                return [1, 0, 1, -0.5];
                            }
                        }
                    }
                }
            },
			tps_re_qiangpo:{
				trigger:{global:'useCard'},
				direct:true,
				priority:5.5,
				filter:function(event,player){
					if(get.type(event.card)=='trick'&&event.cards.length==1&&event.cards[0]==event.card){
						if(event.player==player) return false;
						if(!player.countCards('he',{suit:get.suit(event.card)})) return false;
						return true;
					}
					return false;
				},
				content:function(){
					'step 0'
					var att=get.attitude(player,trigger.player);
					var suit=get.suit(trigger.card);
					player.chooseToDiscard('he',get.prompt2('tps_re_qiangpo',trigger.player),function(card){
						return get.suit(card)==suit;
					}).set('autodelay',true).set('logSkill',['tps_re_qiangpo',trigger.player]).ai=function(card){
						if(att<0){
							return 8-get.value(card);
						}
						return 0;
					};
					'step 1'
					if(result.bool){
						trigger.cancel();
					}
				}
			},
			tps_re_zhuanzhu:{
				trigger:{player:'useCardAfter'},
				filter:function(event,player){
					if(event.parent.name=='tps_re_zhuanzhu') return false;
					if(!event.targets||!event.card) return false;
					if(event.card&&event.card.name=='wuxie') return false;
					var type=get.type(event.card);
					if(type!='trick') return false;
					var card=game.createCard(event.card.name,event.card.suit,event.card.number,event.card.nature);
					var targets=event._targets||event.targets;
					for(var i=0;i<targets.length;i++){
						if(!targets[i].isIn()) return false;
						if(!player.canUse({name:event.card.name},targets[i],false,false)){
							return false;
						}
					}
					return true;
				},
				check:function(event,player){
					if(event.card.name=='tiesuo') return false;
					return true;
				},
				content:function(){
				    "step 0"
				    //get.suit(card)==get.suit(event.card)
				    player.chooseCard({
				        prompt:get.prompt('tps_re_zhuanzhu'),
                        filterCard: function(event, card, player) {
                            return get.suit(card) == get.suit(event.card)
                        },
				    }).set('ai',function(card){
						return 5-get.value(card);
					});
				    "step 1"
					//var card=game.createCard(trigger.card.name,trigger.card.suit,trigger.card.number,trigger.card.nature);
					if(result.bool){
					    player.useCard({
					        name: trigger.card.name,
					        nature: trigger.card.nature
					    },(trigger._targets||trigger.targets).slice(0),result.cards);
					}
				},
				ai:{
					threaten:1.3
				},
			},
			tps_zhuangbi:{
				enable:'phaseUse',
				usable:1,
				filterTarget:function(card,player,target){
					return target!=player&&target.countCards('h')>0;
				},
				selectTarget:[1,3],
				filter:function(event,player){
					return player.countCards('h')>0;
				},
				multitarget:true,
				multiline:true,
				content:function(){
					player.chooseToCompare(targets).callback=lib.skill.tps_zhuangbi.callback;
				},
				init:function(player){
					player.storage.tps_zhuangbi=0;
				},
				intro:{
					name:'饶逼',
					content:'mark'
				},
				chat:['粗鄙之语','天地不容','谄谀之臣','皓首匹夫，苍髯老贼','二臣贼子','断脊之犬','我从未见过有如此厚顔无耻之人！'],
				callback:function(){
					'step 0'
					if(event.num1>event.num2){
						target.chooseToDiscard('he','弃置一张牌，或令'+get.translation(player)+'摸一张牌').set('ai',function(card){
							if(_status.event.goon) return 6-get.value(card);
							return 0;
						}).set('goon',get.attitude(target,player)<0);
					}
					else{
						target.chat(lib.skill.tps_zhuangbi.chat[player.storage.tps_zhuangbi]);
						game.delay();
						player.storage.tps_zhuangbi++;
						player.markSkill('tps_zhuangbi');
						if(player.storage.tps_zhuangbi>=7){
							player.die();
						}
						else{
							// player.chooseToDiscard('弃置一张牌，或摸一张牌').set('ai',function(){return -1;});
							event.finish();
						}
					}
					'step 1'
					if(!result.bool){
						player.draw();
					}
				},
				ai:{
					order:7,
					result:{
						target:function(player,target){
							var num=game.countPlayer(function(current){
								return get.attitude(player,current)<0&&current!=player&&current.countCards('h');
							});
							if(num>3) num=3;
							var hs=player.getCards('h');
							for(var i=0;i<hs.length;i++){
								if(get.value(hs[i])<=6){
									switch(hs[i].number){
										case 13:return -1;
										case 12:if(player.storage.tps_zhuangbi+num<=8) return -1;break;
										case 11:if(player.storage.tps_zhuangbi+num<=7) return -1;break;
										default:if(hs[i].number>5&&player.storage.tps_zhuangbi+num<=6) return -1;
									}
								}
							}
							return 0;
						},
					}
				}
			},
			tps_bici:{
				trigger:{player:'compare'},
				filter:function(event,player){
					return event.getParent().name=='tps_zhuangbi'&&!event.iwhile&&event.num1<=player.storage.tps_zhuangbi;
				},
				content:function(){
					if(trigger.num1<player.storage.tps_zhuangbi){
						trigger.num1+=player.storage.tps_zhuangbi;
					}
					else{
						player.getStat().skill.tps_zhuangbi--;
					}
				}
			},
			tps_chadao:{
				trigger:{global:'phaseEnd'},
				direct:true,
				filter:function(event,player){
					return event.player.isAlive()&&event.player.getStat('damage')&&
					lib.filter.targetEnabled({name:'sha'},player,event.player)&&player.countCards("h");
				},
				check:function(event,player){
					return get.effect(event.player, {
									name: 'sha'
								}, player, event.player);
				},
				content:function(){
				    "step 0"
				    //console.log(get.effect(event.player, {
					//				name: 'sha'
					//			}, player, event.player));
					player.chooseCard('插刀：是否对'+get.translation(trigger.player)+'使用一张问？').set('logSkill','tps_chadao');
					"step 1"
					if(result.bool){
					    player.useCard({
					        name: "sha"
					    },trigger.player,result.cards);
					}
				}
			},
			tps_mengtai:{
				trigger:{target:'shaBegin'},
				priority:5,
				audio:true,
				logTarget:'source',
				filter:function(event,player){
				    //console.log(event);
					if(player.sex=='male'&&event.player.sex=='female') return true;
					if(player.sex=='female'&&event.player.sex=='male') return true;
					return false;
				},
				content:function(){
					"step 0"
					//console.log(trigger);
					trigger.player.chooseToDiscard('弃置一张手牌，或令'+get.translation(player)+'摸一张牌').set('ai',function(card){
						var trigger=_status.event.getTrigger();
						return -get.attitude(trigger.player,player)-get.value(card);
					});
					"step 1"
					if(result.bool==false) player.draw();
				}
			},
            "tps_yonglan": {
                mark: true,
                locked: true,
                marktext: '成',
                intro: {
                    content: function(storage, player, skill) {
                        if (player.storage.tps_yonglan == true) return '出牌阶段限一次，你可以摸两张牌，然后弃置一张手牌。若如此做，直到本回合结束，你使用与弃置牌花色相同的牌无距离和次数限制';
                        return '出牌阶段限一次，你可以摸一张牌，然后弃置两张手牌。若如此做，直到本回合结束，你使用与弃置牌花色相同的牌无距离和次数限制';
                    },
                },
                enable: "phaseUse",
                usable: 1,
                audio: 2,
                filter: function(event, player) {
                    var num = 1;
                    if (player.storage.tps_yonglan == true) num = 0;
                    return player.countCards('h') >= num;
                },
                content: function() {
                    'step 0'
                    if (player.storage.tps_yonglan == true) {
                        player.storage.tps_yonglan = false;
                        player.draw(2);
                        player.chooseToDiscard('h', true);
                    } else {
                        player.storage.tps_yonglan = true;
                        player.draw();
                        player.chooseToDiscard('h', 2, true);
                    };
                    'step 1'
                    if (result.bool) {
                        player.storage.tps_yonglan1 = result.cards;
                        player.addTempSkill('tps_yonglan1', {
                            player: 'phaseAfter'
                        });
                    };
                },
                ai: {
                    order: 13,
                    result: {
                        player: function(player) {
                            if ((player.storage.tps_yonglan == undefined || player.storage.tps_yonglan == false) && player.countCards('h') < 3) return 0;
                            return 1;
                        },
                    },
                },
            },
			"tps_yonglan1":{
				mod:{
					cardUsable:function(card,player){
						var cards=player.storage.tps_yonglan1;
						for(var i=0;i<cards.length;i++){
							if(get.suit(cards[i])==get.suit(card)) return Infinity;
						};
					},
					targetInRange:function(card,player){
						var cards=player.storage.tps_yonglan1;
						for(var i=0;i<cards.length;i++){
							if(get.suit(cards[i])==get.suit(card)) return true;
						};
					}
				},
			},
            "tps_shicai": {
                group: ["tps_shicai_1", "tps_shicai_2", "tps_shicai_3"],
                subSkill: {
                    "1": {
                        trigger: {
                            global: 'phaseBefore'
                        },
                        forced: true,
                        popup: false,
                        content: function() {
                            player.storage.tps_shicai = [];
                        },
                    },
                    "2": {
                        audio: 2,
                        trigger: {
                            global: 'useCardAfter'
                        },
                        filter: function(event, player) {
							//console.log(get.type(event.card)=="delay"?"trick":get.type(event.card));
                            return event.player==player && player.storage.tps_shicai != undefined && !player.storage.tps_shicai.contains(get.type(event.card)=="delay"?"trick":get.type(event.card));
                        },
                        check: function(event, player) {
                            return get.type(event.card) != 'delay';
                        },
                        content: function() {
                            player.storage.tps_shicai.push(get.type(trigger.card));
                            for (var i = 0; i < trigger.cards.length; i++) {
                                ui.cardPile.insertBefore(trigger.cards[i], ui.cardPile.firstChild);
                                if (ui.cardPileNumber) ui.cardPileNumber.innerHTML = game.roundNumber + '轮 剩余牌: ' + ui.cardPile.childNodes.length;
                                game.log(player, '将', trigger.cards[i], '置于牌堆顶');
                                player.lose(trigger.cards[i], ui.special);
                            };
                            player.draw();
                        },
                    },
                    "3": {
                        trigger: {
                            global: 'phaseAfter'
                        },
                        forced: true,
                        popup: false,
                        content: function() {
                            delete player.storage.tps_shicai;
                        },
                    },
                },
            },
            "tps_cunmu": {
                audio: 2,
                trigger: {
                    player: 'drawBegin'
                },
                forced: true,
                content: function() {
                    'step 0'
                    trigger.cancel();
                    event.list = [];
                    event.num = 0;
                    'step 1'
                    event.list.push(ui.cardPile.removeChild(ui.cardPile.lastChild));
                    event.num++;
                    if (event.num < trigger.num) event.redo();
                    'step 2'
                    if (ui.cardPileNumber) ui.cardPileNumber.innerHTML = game.roundNumber + '轮 剩余牌: ' + ui.cardPile.childNodes.length;
                    player.gain(event.list);
                    player.$draw(trigger.num);
                    game.log(player, '从牌堆底摸' + get.cnNumber(trigger.num) + '张牌');
                },
            },
			tps_re_mensao: {
                audio: 2,
                trigger: {
                    target: 'useCardToBefore'
                },
                forced: true,
                filter: function(event, player) {
                    //if(event.)
                    console.log(event);
                    return get.type(event.card) == 'trick' && event.player != player && event.parent.parent.name!="tps_re_mensao";
                },
                content: function() {
                    "step 0"
                    trigger.cancel();
                    trigger.player.useCard({
                        name:"sha",
                        suit:get.suit(trigger.card),
						number:get.number(trigger.card),
						type:"basic"
                    },player,"noai");
                },
                ai: {
                    effect: {
                        target: function(card, player, target, current) {
                            if (get.type(card) == 'trick' && get.attitude(player, target) < 0) {
                                return get.effect(player, {name:'sha'}, target, player);
                                //return [1, 0, 1, -0.5];
                            }
                        },
                    }
                }
            },
			tps_huibi:{
				audio:2,
				trigger:{player:'phaseDrawBegin'},
				check:function(event,player){
					return player.countCards('h')<=player.maxHp||player.skipList.contains('phaseUse');
				},
				content:function(){
					trigger.num+=game.countGroup();
					player.addTempSkill('tps_huibi2');

				},
				ai:{
					threaten:1.5
				}
			},
			tps_huibi2:{
				mod:{
					playerEnabled:function(card,player,target){
						if(player!=target) return false;
					}
				}
			},
			tps_school_hg:{
				group:['tps_school_hg1']
			},
			tps_school_hg1:{/*
				mark:true,
				intro:{
					content:function(dialog,content,player){
						return '作为一个杭高人，当你拥有杭高梦想时，你就可以像【杭高林欢】一样装逼：结束阶段开始时，你可以摸等同于你手牌数的牌，若如此做，你须展示你的手牌，然后每当你受到一点扣分时，你必须选择一项：1.失去一点体力，2.弃两张牌';
					}
				},*/
				trigger:{player:"phaseEnd"},
                filter: function(event, player) {
					if(!lib.config.schoolMod)return false;
                    return player.getEquip(4)&&player.getEquip(4).name=="chitu";
				},
				check: true,
				content:function(){
					player.draw(player.countCards("h"));
					player.showHandcards();
					player.addTempSkill('tps_school_hg2', {
						player: 'phaseBegin'
					});
				}
			},
			tps_school_hg2:{
				forced:true,
				trigger:{player:"damageEnd"},
                filter: function(event, player) {
                    return player.getEquip(4)&&player.getEquip(4).name=="chitu";
                },
				content:function(){
					"step 0"
					event.num=trigger.num;
					event.num2 = 0;
					"step 1"
					if(player.countCards('h')>=2)
						player.chooseControl('失去1点分数','弃两张手牌').set('prompt',"对不起，林欢同学，你必须为你的行为付出代价<br/><strong>注意：</strong>你还需再完成 "+(event.num-1).toString()+" 次选择").ai=function(){
							return 1;
						};
					"step 2"
					if(player.countCards('h')>=2){
						if(result.control=='弃两张手牌'){
							player.chooseToDiscard('h', true, 2);
						}else{
							event.num2 ++;
						}
					}else{
						event.num2 ++;
					}
					event.num--;
					if(event.num==0){
						player.loseHp(event.num2);
						event.finish();
					}
					"step 3"
					event.goto(1);
				}
			},
			tps_school_2z:{
				group:['tps_school_2z1']
			},
			/*tps_school_2z1:{
				trigger:{player:"phaseEnd"},
                filter: function(event, player) {
					if(!lib.config.schoolMod)return false;
                    return player.getEquip(3)&&player.getEquip(3).name=="hualiu";
				},
				check: true,
				content:function(){
					player.addTempSkill('tps_school_2z2', {
						player: 'phaseEnd'
					});
				}
			},
			tps_school_2z2:{
				//group:["tps_school_2z_3"],
				forced:true,
				mod: {
					suit: function (card, suit) {
						return "diamond";
					},
					nature: function (card, nature) {
						return 'thunder';
					},
					globalFrom:function(from,to,current){
						if(to.hp<from.hp)
						return 1;
					},
					globalTo:function(from,to,current){
						if(to.hp<from.hp)
						return current*2;
					},
				},
			},
			tps_school_2z3:{
				forced:true,
				trigger:{target:'compare'},
				filter:function(event,player){
					return player.getEquip(3)&&player.getEquip(3).name=="hualiu"&&!event.iwhile;
				},
				content:function(){
					trigger.num1=13;
				}
			},*/
			tps_school_2z1:{
				enable:'phaseUse',
				usable:1,
				filterCard:true,
				filter:function(event,player){
					if(!lib.config.schoolMod)return false;
					return player.getEquip(3)&&player.getEquip(3).name=="hualiu"&&!event.iwhile;
				},
				filterTarget:function(card,player,target){
					return player!=target&&!target.hasSkill('tps_school_2z2');
				},
				prepare:'throw',
				discard:false,
				content:function(){
					target.$gain2(cards);
					target.storage.tps_school_2z2=cards[0];
					target.addSkill('tps_school_2z2');
					target.storage.tps_school_2z13=player;
					ui.special.appendChild(cards[0]);
					target.syncStorage('tps_school_2z2');
				},
				check:function(card){
					return 6-get.value(card)
				},
				ai:{
					expose:0.1,
					order:4,
					result:{
						target:function(player,target){
							if(target.hasSkillTag('maixie')) return 0;
							return -1;
						}
					}
				},
				group:['tps_school_2z1_die','tps_school_2z1_gain'],
				subSkill:{
					die:{
						trigger:{player:'dieBegin'},
						silent:true,
						content:function(){
							for(var i=0;i<game.players.length;i++){
								if(game.players[i].hasSkill('tps_school_2z2')&&game.players[i].storage.tps_school_2z13==player){
									game.players[i].removeSkill('tps_school_2z2');
								}
							}
						}
					},
					gain:{
						trigger:{player:'phaseBegin'},
						silent:true,
						content:function(){
							for(var i=0;i<game.players.length;i++){
								if(game.players[i].hasSkill('tps_school_2z2')&&game.players[i].storage.tps_school_2z13==player){
									var card=game.players[i].storage.tps_school_2z2;
									game.players[i].removeSkill('tps_school_2z2');
									game.players[i].$give(card,player);
									player.gain(card);
								}
							}
						}
					}
				}
			},
			tps_school_2z2:{
				trigger:{player:'respondAfter'},
				forced:true,
				priority:10,
				mark:'card',
				popup:false,
				filter:function(event,player){
					return event.card&&event.card.name=='shan'&&player.storage.tps_school_2z13&&player.storage.tps_school_2z13.isIn();
				},
				content:function(){
					'step 0'
					player.storage.tps_school_2z13.logSkill('tps_school_2z1',player);
					player.judge(function(card){
						var suit=get.suit(card);
						if(suit=='heart'||suit=='diamond'){
							return -1;
						}
						else{
							return 0;
						}
					});
					'step 1'
					var source=player.storage.tps_school_2z13;
					if(result.suit=='diamond'){
						player.damage('fire',source);
						if(player.countCards('h')){
							player.randomDiscard('h');
						}
					}
					else if(result.suit=='heart'){
						player.damage('fire',2,source);
					}
				},
				intro:{
					content:'card'
				},
				onremove:function(player){
					player.storage.tps_school_2z2.discard();
					delete player.storage.tps_school_2z2;
					delete player.storage.tps_school_2z13;
				},
				ai:{
					noShan:true
				}
			},
            tps_nudui:{
				group:["tps_nudui1"],
				audio:2,
				trigger:{player:'phaseBegin'},
				direct:true,
				init:function(player){
					player.storage.tps_nudui=true;
					// player.storage.tps_nixue2=0;
				},
				filter:function(event,player){
					return player.storage.tps_nudui;
				},
				content:function(){
					"step 0"
					player.chooseTarget(get.prompt('tps_nudui'),function(card, player, target) {
                        return target != player
                    },1).ai = function (target) {
						//console.log(target);
						if (target.hasSkill('hongyan'))
							return 0;
						return get.damageEffect(target, _status.event.player, _status.event.player);
					};
					"step 1"
					if(result.bool){
						result.targets[0].addSkill("tps_nudui2");
					}
					player.storage.tps_nudui=false;
				},
				ai:{
					threaten:0.8,
				}
			},
            tps_nudui1:{
				audio:2,
				trigger:{global:'dieAfter'},
				filter:function(event,player){
					return event.player.hasSkill("tps_nudui2");
				},
				content:function(){
					"step 0"
					player.draw(3);
					"step 1"
					//console.log(event);
					if(trigger.source==player){
						player.chooseTarget(get.prompt('tps_nudui1'),function(card, player, target) {
							return target != player
						},1).ai = function (player,target) {
							if (target.hasSkill('hongyan'))
								return 0;
							return !get.attitude(player,target);
						};
					}
					"step 2"
					if(trigger.source==player && result.bool){
						result.targets[0].addSkill("tps_nudui2");
					}
				},
				ai:{
					threaten:0.8,
				}
			},
			tps_nudui2:{
				mark:true,
				intro:{
					content:function(dialog,content,player){
						return '你成为了怒怼的对象，所有来自拥有“怒怼”技能的角色对你的伤害×2。';
					}
				},
				audio: 2,
				trigger: {
					player: 'damageBefore'
				},
				forced: true,
				filter: function(event, player) {
					return event.source.hasSkill('tps_nudui');
				},
				content: function() {
					"step 0"
					trigger.source.chooseToDiscard(get.prompt('tps_nudui1'),'he',1);
					"step 1"
					if(result.bool){
						trigger.num*=2;
					}
				},
			},
			tps_school_xj:{
				group:['tps_school_xj1']
			},
			tps_school_xj1:{
				enable:'phaseUse',
				usable:1,
				filter:function(event,player){
					if(!lib.config.schoolMod)return false;
					return player.getEquip(4)&&player.getEquip(4).name=="zixin"&&!event.iwhile;
				},
				selectTarget:1,
				filterTarget:function(card,player,target){
					return player!=target;
				},
				content:function(){
					var card = player.getEquip(4);
					game.swapSeat(player,target);
					player.$gain2(card);
					player.storage.tps_school_xj2=card;
					player.addSkill('tps_school_xj2');
					ui.special.appendChild(card);
					player.syncStorage('tps_school_xj2');
				},
				ai:{
					order:5,
					result:{
						player:function(player,target){
							var att=get.attitude(player,target);
							if(target==player.previous&&att>0) return att;
							if(target==player.next&&att<0) return -att;
							var att2=get.attitude(player,player.next);
							if(target==player.next.next&&att<0&&att2<0) return -att-att2;
							return 0;
						}
					}
				},
			},
			tps_school_xj2:{
				mark:'card',
				intro:{
					content:'card'
				},
				//group:["tps_school_2z_3"],
				forced:true,
				mod: {
					globalFrom:function(from,to,current){
						return current-Math.min(from.hp,3)+1;
					},
				},
			},
			tps_school_14:{
				group:['tps_school_141','tps_school_142']
			},
			tps_school_141: {
				filter:function(event,player){
					if(!lib.config.schoolMod)return false;
					return player.getEquip(4)&&player.getEquip(4).name=="dawan";
				},
				audio: 2,
				trigger: {
					player: "phaseDrawBegin",
				},
				content: function () {
					trigger.num++;
				},
				ai: {
					threaten: 1.3,
				},
			},
			tps_school_142:{
				audio:2,
				trigger:{player:'loseEnd'},
				filter:function(event,player){
					if(!lib.config.schoolMod)return false;
					if(!player.getEquip(4)||player.getEquip(4).name!="dawan") return false;
					if(player.countCards('h')||player==_status.currentPhase) return false;
					for(var i=0;i<event.cards.length;i++){
						if(event.cards[i].original=='h') return true;
					}
					return false;
				},
				content:function(){
					player.draw(2);
				},
				ai:{
					threaten:0.8,
					effect:{
						target:function(card){
							if(card.name=='guohe'||card.name=='liuxinghuoyu') return 0.5;
						}
					},
					noh:true,
					skillTagFilter:function(player,tag){
						if(tag=='noh'){
							if(player.countCards('h')!=1) return false;
						}
					}
				}
			},
		},
		translate: {
            tps_teachers:"东南·教职工",
            tps_students:"东南·201904",
            tps_old:"东南·原始版本",

			tps_re_liujiqing:"柳季青",
			tps_re_xiaohong:"肖泓",
			tps_zhoulinghang: "周凌航",
			tps_re_hezihang: "贺梓航",
			tps_wangzile: "王梓乐",
			tps_wangguiyang: "王贵炀",
			tps_wumengxiang: "吴孟祥",
			tps_re_shiao:"施敖",
			tps_xuheng: "徐珩",
			tps_re_huanghaojun:"黄浩峻",
			tps_re_zhengqihang:"郑启航",
			tps_re_chenkaihao:"陈凯豪",
			tps_xujingyi: "徐憬怿",
			tps_hushiqun: "胡识群",
			tps_re_lujunyu:"卢俊羽",
			tps_re_shouxintao:"寿鑫涛",
			tps_re_xusichen: "徐思辰",
			tps_maozihao: "毛子豪",
			tps_zhanglingkai: "张凌凯",
			tps_re_gechenqi: "葛辰启",
			tps_chenzhanhao: "陈占豪",
			tps_chenzhenbo: "陈桢博",
			tps_yuanyuxuan: "袁雨轩",
			tps_re_chenhongliang: "陈泓亮",
			tps_re_panhaotian: "潘皓天",
			tps_liangyue: "梁越",
			tps_yaohuangshen: "姚皇燊",
			tps_re_fangyiyuan: "方易圆",
			tps_re_zhangyihe: "章易禾",
			tps_chengjingya: "程竞雅",
			tps_liuchun: "刘纯",
			tps_wangxiaoya: "王筱雅",
			tps_luxinting: "卢鑫廷",
			tps_re_wangjing: "王晶",
			//tps_re_zhangjiahui: "张佳慧",
			tps_zhangjiahui: "张佳慧",
			tps_mouminzi: "牟旻紫",
			tps_re_chenyimiao: "陈轶淼",
			tps_re_laileshang: "赖乐商",
			tps_re_wangchenxiao: "汪晨筱",
			tps_re_zhangche: "张彻",
			tps_jiangxiyu: "蒋习羽",
			tps_re_liufangfei: "刘芳菲",
			tps_re_yuruijia: "俞瑞佳",
			tps_laimeixi: "来美羲",
			tps_xuqingyi: "徐晴宜",
			tps_wanglina: "王丽娜",
			
			tps_xpsj: "香泡四杰",
			tps_re_wangjie:'王洁',

			tps_panhaotian: "旧潘皓天",
			tps_chenhongliang: "旧陈泓亮",
			tps_shiao: "旧施敖",
			tps_huanghaojun: "旧黄浩峻",
			tps_zhengqihang: "旧郑启航",
			tps_chenkaihao: "旧陈凯豪",
			tps_xusichen: "旧徐思辰",
			tps_zhangyihe: "旧章易禾",
			tps_wangjing: "旧王晶",
			tps_laileshang: "旧赖乐商",
			tps_zhangche: "旧张彻",
			tps_liujiqing: "旧柳季青",
			tps_shouxintao: "旧寿鑫涛",
			tps_gechenqi: "旧葛辰启",
			tps_xiaohong: "旧肖泓",
			tps_liufangfei: "旧刘芳菲",
			tps_chenyimiao: "旧陈轶淼",
			tps_hezihang: "旧贺梓航",
			tps_lujunyu: "旧卢俊羽",
			tps_fangyiyuan: "旧方易圆",
			tps_wangchengxiao: "旧汪晨筱",
			tps_yuruijia: "旧俞瑞佳",
			tps_wangjie: "旧王洁",
			
			tps_shenguojun: "沈老师",
			tps_geyanglin: "葛大爷",
			tps_wangmeidie: "王小虫",
			tps_sunbohua: "孙百叶",
			tps_jiangmin: "蒋老师",
			tps_gaoyanzhong: "郜校长",
			tps_xubiyuan: "徐校长",
			tps_qianjunlei: "钱老师",
			tps_wanghongge: "老王",
			tps_renyanguo: "任老板",
			tps_zhangjingchao: "超姐",
			tps_dingjianxin: "丁老师",
			tps_zhouxiaoyan: "周老师",
			tps_huzhichao: "超哥",
			tps_zhujianglu: "小天使",

			tiba: "题霸",
			tiba_info: "你可以将一张理科手牌当[答]使用或打出",
			shensi: "神思",
			shensi_info: "准备阶段，你可以进行一定判定，若为理科则可以继续判定，直到出现文科。然后你获得所有理科的判定牌。",
			shensi_info_alter: "准备阶段，你可以进行一定判定，若为理科则可以继续判定，直到出现文科。然后你获得所有理科的判定牌。你通过神思获得的牌，不计入当前回合的手牌上限",
			liangong: "连攻",
			liangong_info: "每当你使用的【问】被目标角色使用的【答】抵消时，你可以对其使用一张【问】（无距离限制）。",
			tps_bufa: "不法",
			tps_bufa_info: "你可以将一张科学花色的手牌当[就寝讲话]使用",
			tps_bangtou: "帮头",
			tps_bangtou_info: "你可以将一张科学手牌当【结派】使用，若以此法使用的【结派】仅指定一个目标，你摸一张牌；你可以重做科学牌",
			tps_siren: "死人",
			tps_siren_info: "锁定技，在你退学前，若你的分数值不大于0，亮出牌堆顶的一张牌并置于你的角色牌上，若此牌的点数与你角色牌上已有的牌点数均不同，则你回复至1分数。只要你的角色牌上有牌，你的手牌上限便与这些牌数量相等",
			tps_zilian: "自恋",
			tps_zilian_info: "你可以将你的任意一张数学或科学手牌当【我很优秀】使用。",
			tps_jinze: "尽责",
			tps_jinze_info: "锁定技，你使用的【问】需要两张【答】响应",
			tps_gaizi: "改字",
			tps_gaizi_info: "你可以将[问]当[答]，或[答]当[问]使用或打出",
			tps_gaile: "改了",
			tps_gaile_info: "在任意角色的判定牌生效前，你可以打出一张牌代替之",
			tps_wanji: "完击",
			tps_wanji_info: "你可以将你的任意一张数学或科学手牌当【我很优秀】使用。",
			tps_zifu: "自负",
			tps_zifu_info: "你可以将一张英语花色的手牌当[罚站]使用",
			//tps_yixue: "易学",
			//tps_yixue_info: "所有人都展示角色牌后，你随机获得两张未加入游戏的角色牌，选一张置于你面前并声明该角色的一项技能，你拥有该技能且同时将性别和势力属性变成与该角色相同知道该易学被替换。在你的每个准备阶段和结束后，你可以替换易学牌，你须为新的易学重新声明一项技能（你不可声明限定技、觉醒技或班长技）。",
			tps_jiwei: "纪委",
			tps_jiwei_info: "你可以选择一项：将一张英语花色牌当做【罚站】使用；或弃置一张英语花色牌并弃置场上的一张【罚站】。选择完成后，你摸一张牌。",
			tps_jianguan: "监管",
			tps_jianguan_info: "你可以将一张英语花色的手牌当[罚站]使用",
			tps_zuobi: "作弊",
			tps_zuobi_info: "你的手牌上限+2。",
			tps_zaoli: "早离",
			tps_zaoli_info: "锁定技，问死你的角色立即退学。",
			tps_qinxue: "勤学",
			tps_qinxue_info: "摸牌阶段，你可以额外摸三张牌",
			tps_tianwen: "偏文",
			tps_tianwen_info: "锁定技，你的英语牌均视为语文",
			tps_miaobi: "妙笔",
			tps_miaobi_info: "你可以将一张文科科手牌当[答]使用或打出",
			tps_bili: "比高",
			tps_bili_info: "出牌阶段限一次，你可以与一名其他角色排名，若你赢，则直到回合结束，该角色不能使用或打出手牌且其非锁定技失效，若你没赢，你可令该角色回复一点分数。",
			tps_wencai: "文采",
			tps_wencai_info: "当你成为[问]的目标时，可以弃置一张牌将其转移给攻击范围内的一名其他角色，此角色不能是[问]的使用者",
			tps_jinye: "敬业",
			tps_jinye_info: "出牌阶段，你使用[问]无数量限制",
			tps_fanxing: "反省",
			tps_fanxing_info: "你可以将一张科学花色的手牌当[集体补课]使用",
			tps_guanban: "管班",
			tps_guanban_info: "锁定技，你使用的【问】或【辩论】需要两张【答】或【问】响应",
			tps_kuanrong: "宽容",
			tps_kuanrong_info: "出牌阶段，你可以弃置一张手牌令一名角色回复一点分数，每阶段限一次",
			tps_chaqin: "查寝",
			tps_chaqin_info: "你可以将一张任意牌当[查寝]使用",
			tps_chachu: "查处",
			tps_chachu_info: "你可以将一张科学花色的手牌当[抽查]使用",
			tps_laoshou: "老手",
			tps_laoshou_info: "摸牌阶段，你可以额外摸一张牌",
			tps_laolian: "老练",
			tps_laolian_info: "你的手牌上限+1。",
			tps_huashui: "滑水",
			tps_huashui_info: "锁定技，当你没有手牌时，不能成为[问]或[辩论]的目标",
			tps_wudi: "无敌",
			tps_wudi_info: "锁定技，游戏开始时，你的血量变为无限，且你多摸4张牌。",
			tps_shoucuo: "受挫",
			tps_shoucuo_info: "锁定技 每当你失去1点分数后，你弃两张牌。",
			tps_duoluo: "堕落",
			tps_duoluo_info: "觉醒技，准备阶段，若你没有手牌，你立即退学。",
			tps_yali: "压力",
			tps_yali_info: "你可以将两张与你本回合以此法转化的花色均不相同的手牌当【阶段测验】使用，然后当一名已受伤的角色因响应此牌而打出【答】时，该角色摸一张牌",
			tps_weiwang: "威望",
			tps_weiwang_info: "班长技，场上每有一名其他文科角色存活，你的手牌上限便+2。",
			tps_jingxin: "静心",
			tps_jingxin_info: "锁定技，不能成为[资料漏发]或[罚站]的目标",
			tps_yifen: "遗愤",
			tps_yifen_info: "锁定技，问死你的角色受到3点校级扣分。",
			tps_bier: "闭耳",
			tps_bier_info: "锁定技，你不能成【问】目标",
			tps_weigui: "违规",
			tps_weigui_info: "每当你使用【问】指定一名目标角色后，你无视其教辅。",
			tps_yuanhuo: "怨火",
			tps_yuanhuo_info: "你可以将【问】当【年级作业】使用或打出。",
			tps_tianshi: "天师",
			tps_tianshi_info: "锁定技，准备阶段，你观看牌堆的X张牌(X为场上存活人数)并且任意移动Y张牌(Y为你当前分数值)",
			tps_qianshui: "潜水",
			tps_qianshui_info: "你不能成为理科动作的目标。",
			tps_renqing: "人情",
			tps_renqing_info: "锁定技，你每次收到扣分时你只收到1点扣分（防止多余的扣分）。",
			tps_baohou: "暴吼",
			tps_baohou_info: "限定技，出牌阶段，可令除你外的所有角色依次对与其距离最近的另一名角色使用一张【问】，无法如此做者失去1点分数。",
			tps_juehou: "绝后",
			tps_juehou_info: "每当你使用问命中目标后，你可以防止扣分，改为令目标旷课状态。",
			tps_youxiu: "优秀",
			tps_youxiu_info: "锁定技，理科的问对你无效",
			tps_shigu: "事故",
			tps_shigu_info: "出牌阶段限一次，你可以弃置一张牌，然后失去1点分数。",
			tps_zhuangzhuang: "壮壮",
			tps_zhuangzhuang2: "壮壮",
			tps_zhuangzhuang_info: "锁定技 每当你失去1点分数后，你摸三张牌。然后若此时是你的出牌阶段，则直到回合结束，你使用文科【问】无距离限制且不能被【答】响应，你可以额外使用一张【问】。",
			tps_yinshang: "阴伤",
			tps_yinshang_info: "每当你使用或打出一张【答】，可令任意一名角色进行一次判定，若结果为科学，其受到一点校级扣分，然后你回复一点分数；若结果为数学，其受到两点校级扣分",
			tps_wulai: "无赖",
			tps_wulai_info: "任意一名角色的判定生效前，你可以打出一张理科牌替换之",
			tps_jianlou: "捡漏",
			tps_jianlou_info: "其他角色使用或打出一张【答】时，你可在结算完成后弃置一张牌并获得之。",
			tps_huyou: "忽悠",
			tps_huyou1: "忽悠",
			tps_huyou2: "忽悠",
			tps_huyou_info: "锁定技，【多想多问】、【阶段测验】对你无效；若其他角色使用的【多想多问】、【阶段测验】在结算完时进入弃牌堆，你立即获得它。",
			tps_songwei: '颂威',
			tps_songwei2: '颂威',
			tps_songwei_info: '班长技，其他理势力的角色的判定牌结果为数学或科学且生效后，可以让你摸一张牌。',
			tps_fengkuang: '疯狂',
			tps_fengkuang_info: "限定技，出牌阶段，可令除你外的所有角色受到1点校级扣分。",
			tps_shikong: '失控',
			tps_shikong_info: "限定技，出牌阶段，可令除你外的所有角色受到1点年级扣分。",
			tps_shenghua: '生花',
			tps_shenghua_info: "你受到扣分时，你可以进行一定判定，若为文科则可以继续判定，直到出现理科。然后你获得所有文科的判定牌。",
			tps_shenghua_info_alter: "你受到扣分时，你可以进行一定判定，若为文科则可以继续判定，直到出现理科。然后你获得所有文科的判定牌。你通过生花获得的牌，不计入当前回合的手牌上限",
			tps_xingyun: '幸运',
			tps_xingyun_info: '你受到扣分时，若判定结果不为语文2~9，则你不受此扣分。',
			tps_luanma: '乱码',
			tps_luanma_info: '准备阶段，你可以进行一定判定，若为英语A，你与你同阵营的人全部退学（非身份模式下判定立即失败）；若为英语2，你弃10张牌并跳过摸牌和出牌阶段；若为英语3，你弃5张牌；若为英语4，你立即退学；若为英语5，你立即翻面；若为科学A，与你不同阵营的人全部退学（非身份模式下判定立即胜利）；若为科学2，你摸10张牌；若为科学3，你摸5张牌；若为科学4，你可选择一个人令其立即退学；若为科学5，你可选择一个人令其立即翻面。',
			tps_luanma_info_later: '准备阶段，你可以进行一定判定，若为英语A，你与你同阵营的人全部退学（非身份模式下判定立即失败）；若为英语2，你弃10张牌并跳过摸牌和出牌阶段；若为英语3，你弃5张牌；若为英语4，你立即退学；若为英语5，你立即翻面；若为科学A，与你不同阵营的人全部退学（非身份模式下判定立即胜利）；若为科学2，你摸10张牌；若为科学3，你摸5张牌；若为科学4，你可选择一个人令其立即退学；若为科学5，你可选择一个人令其立即翻面。',
			tps_shulian:'熟练',
			tps_shulian_info:'锁定技，结束阶段开始时，你获得一个额外的回合，然后跳过该额外回合的结束阶段。',
			tps_pengzhang:'膨胀',
			tps_pengzhang_info:'锁定技，每当你造成一点扣分，你摸两张牌。',
			tps_zhuli: "助理",
			tps_zhuli_info: "你可以将一张文科的手牌当[抽查]使用",
			tps_zhitiao:'纸条',
			tps_zhitiao_info:'每当你使用或打出一张手牌时，你可以亮出牌堆顶的一张牌，若此牌与你此次使用或打出的牌类别相同，你可以将之交给任意一名角色；若不同则你可以将之置入弃牌堆。',
			tps_tongxiao: "通校",
			tps_tongxiao_info: "锁定技，你不能成为[查寝]的目标",
			tps_gemo:"隔膜",
			tps_gemo_info:"锁定技，你的防御距离+3",
			tps_cangni:"藏匿",
			tps_cangni_info:'每当一张延时类动作牌或其他角色使用的普通动作牌生效时，若你是此牌的唯一目标，你可以将所有手牌置于你的角色牌上，若如此做，此回合结束时，你获得你角色牌上的所有牌。',
			tps_qiangpo:"强迫",
			tps_qiangpo_info:"当你使用【问】时，若目标的手牌数大于等于你的分数值，或小于等于你的攻击范围，你可令此【问】不能避答",
			tps_zhuanzhu:"专注",
			tps_zhuanzhu_info:'在你的回合，除你以外，只有处于将退学状态的角色才能使用【习】。',
			tps_caiyi: "才艺",
			tps_caiyi_info: "每当你使用或打出一张【答】，可视为对任意一名角色出一张【问】",
			tps_fuyou: "妇友",
			tps_fuyou2: "妇友",
			tps_fuyou_info: "每当你对一名女性角色造成一点扣分时，该角色获得一枚“友尽”标记；没有“友尽”标记的女性角色无法对你造成扣分。",
			tps_fuyou_info_alter: "每当你对一名女性角色造成一点扣分时，该角色获得一枚“友尽”标记；没有“友尽”标记的女性角色无法对你造成扣分。",
			tps_mensao: "闷骚",
			tps_mensao_info: "锁定技，【抽查】、【查寝】、【没收】、【抛砖引玉】、【辩论】无法指定你为目标。",
			tps_shangjin:'上进',
			tps_shangjin_info:'每当一名角色的手牌于回合外被弃置时，你可以失去1点分数，然后该角色摸两张牌。',
			tps_zuosi:'作死',
			tps_zuosi_info:'出牌阶段，你可以失去一点分数并摸两张牌',
			tps_shuipi:'水批',
			tps_shuipi_info:'出牌阶段限一次，你可以将一张语文牌当【圈画重点】使用或打出',
			tps_feili:'非礼',
			tps_feili_info:'锁定技，你对男性角色出【问】无法被避答。',
			tps_juai:'拒爱',
			tps_juai_info:'锁定技，每当你受到男性角色的一次扣分，你获得一枚“拒”标记。',
			tps_huoai:'获爱',
			tps_huoai_info:'觉醒技，准备阶段，若你的“拒”标记≥3个，你失去一点分数上限并获得技能【报复】、【不法】和【集智】。',
			tps_baofu:'报复',
			tps_baofu_info:'每当你受到男性1点扣分后，可进行一次判定，若结果为理科，你对扣分来源造成1点扣分。',
			tps_qiling:'麒麟',
			tps_qiling_info:'当你使用一张【问】时，可进行一次判定，若为【问】则此【问】不可避答且信心值扣分+1',
			tps_longduan:'垄断',
			tps_longduan_info:'限定技，你可以在任何能能出牌的时候弃置一张牌，令一名分数值未满的角色将分数加至分数上上限并摸回复分数*2的牌。',
			tps_huangpao:'黄袍',
			tps_huangpao1:'黄袍',
			tps_huangpao_info:'摸牌阶段，你额外摸1张牌；你的手牌上限+3.',
			tps_jinji:'进击',
			tps_jinji_info:'锁定技，准备阶段，你获得一个“进”标志，若此时你“进”标志数量为3的倍数则你恢复一点信心值.',
			tps_tujin:'突进',
			tps_tujin_info:'限定技，你令一名角色退学时，你可指定一名角色，若如此做，你失去一点信心值并令该角色受到两点年级扣分。',
			tps_guanlan:'灌篮',
			tps_guanlan_info:'每当你造成一次信心值扣分时可进行一次判定，若为语文则数量×2.',
			tps_tuifei:'颓废',
			tps_tuifei_info:'锁定技，信心值不大于你的角色对你的信心值扣分×2.',
			tps_zuobie:'作别',
			tps_zuobie_info:'你死后，可指定一名角色，其受到两点扣分并失去一点分数上限.',
			tps_sunyou:'损友',
			tps_sunyou_info:'锁定技，所有女性角色均被结派，所有男性角色均不能被结派.',
			tps_fanren:'烦人',
			tps_fanren_info:'其他角色的准备阶段，你可弃置一张牌，摸其一张牌.',
			tps_zhuangruo:'装弱',
			tps_zhuangruo_info:'锁定技，当你解除将退学状态后，令你进入将退学状态的角色失去一点分数',
			tps_yixue:'易学',
			tps_yixue2:'易学',
			tps_yixue3:'易学',
			tps_yixue3_bg:'学',
			tps_yixue_info:'锁定技，每当一名其他角色被退学，你获得一个与该角色同名且分数上限为1、初始手牌为2的易学牌；出牌阶段，你可以进入易学状态（在易学状态被退学前不可再次切换）',
			tps_nianmai: "年迈",
			tps_nianmai_info: "锁定技，在你退学前，若你分数值不大于0，亮出牌堆顶的一张牌并置于你的角色牌上，若此牌的点数-4后不大于场上总人数，则你分数上限+1且分数回复至分数上限。若此时你角色牌上牌的数量大于场上总人数，你失去并将分数上限回复至1.",
			tps_fafen:'发奋',
			tps_fafen_info:'觉醒技，当你解除将退学状态后，你增加一点分数上限，并获得技能“复出”和“优秀”。',
			tps_fuchu:'复出',
			tps_fuchu_info:'觉醒技，当你解除将退学状态后，你失去一点分数上限，将分数回复至分数上限，并获得技能“登顶”和“神思”。',
			tps_dengding:'登顶',
			tps_dengding_info:'觉醒技，当你解除将退学状态后，你获得技能“疯狂”并获得一个额外回合。',
		    tps_tiankeng:'天坑',
			tps_tiankeng_info:'当一名角色使用【答】后，你可摸一张牌。',
		    tps_nanti:'难题',
			tps_nanti_info:'你可令你的非普通【问】无法被回避。',
			tps_xiaozhang:'校长',
			tps_xiaozhang_info:'锁定技，每当你即将造成扣分时，若该扣分为校级扣分，扣分数量*3，否则该扣分视为校级扣分。',
		    tps_zongheng:'纵横',
		    tps_zongheng_info:'当你失去最后的手牌时，你可获得其他所有角色各一张牌。',
		    tps_dalue:'大略',
		    tps_dalue_info:'限定技，出牌阶段，你可获得其他所有角色所有牌。',
		    tps_yuben:'愚笨',
		    tps_yuben_info:'锁定技，你与他人的距离+1，其他人与你的距离-1。',
		    tps_guaili:'怪力',
		    tps_guaili_info:'你可将所有牌当【辩论】使用。',
		    tps_xiabi:'瞎逼',
		    tps_xiabi_info:'出牌阶段，你可将(X+1)张牌当任意一张非延时动作牌或基本牌使用（X为本回合你已发动此技能的次数）。',
			tps_qingui:'寝鬼',
			tps_qingui1:'寝鬼',
			tps_qingui_info:'每当你失去分数或受到两点及以上的扣分时，若你未旷课，你可将手牌补至分数上限，然后旷课。',
			tps_cuimian:'催眠',
			tps_cuimian2:'催眠',
			tps_cuimian_info:'出牌阶段限一次，你可以弃置两张牌并选择一名其他角色，该角色反面，然后直到该角色的回合开始，其不能成为“催眠”的目标',
			/*
			debug_lmk1:"乱码-科1",
			debug_lmk1_info:"乱码-科1",
			debug_lmk2:"乱码-科2",
			debug_lmk2_info:"乱码-科2",
			debug_lmk3:"乱码-科3",
			debug_lmk3_info:"乱码-科3",
			debug_lmk4:"乱码-科4",
			debug_lmk4_info:"乱码-科4",
			debug_lmk5:"乱码-科5",
			debug_lmk5_info:"乱码-科5",
			debug_lmy1:"乱码-英1",
			debug_lmy1_info:"乱码-英1",
			debug_lmy2:"乱码-英2",
			debug_lmy2_info:"乱码-英2",
			debug_lmy3:"乱码-英3",
			debug_lmy3_info:"乱码-英3",
			debug_lmy4:"乱码-英4",
			debug_lmy4_info:"乱码-英4",
			debug_lmy5:"乱码-英5",
			debug_lmy5_info:"乱码-英5",*/
		},
	};
	if(lib.config.extension_太平联机_enable&&lib.config.extension_太平联机_show){
	    result.character={
			tps_re_liujiqing:['male','shen',3,["tps_lianzhi","tps_re_jingxin","tps_school_2z"],["shu","tps"]],
			tps_re_xiaohong:['male','shen',3,['tps_zhuangbi','tps_bici',"tps_school_2z"],['shu']],
			tps_zhoulinghang: ['male', 'wu', 3, ['tps_pengzhang','tps_yifen','tps_school_xj']],
			tps_re_hezihang: ['male', 'qun', 3, ['tps_re_caiyi','tps_fuyou','tps_school_xj']],
			tps_wangzile: ['male', 'qun', 2, ['tps_xingyun', 'tps_laolian','tps_school_14']],
			tps_wangguiyang: ['male', 'wu', 3, ['tps_xiabi']],
			tps_wumengxiang: ['male', 'wu', 6, ['benghuai','tps_qingui']],
			tps_re_shiao: ['male', 'shu', 4, ['tps_re_bufa', 'tps_bangtou','tps_langxing','tps_school_xj']],
			tps_xuheng: ['male', 'wu', 3, ['tps_bier','tps_school_xj']],
			tps_re_huanghaojun: ['male', 'wei', 4, ['tps_siren','tps_zuosi','tps_re_shangjin']],
			tps_re_zhengqihang:['male','shu',4,['tps_re_qianshui','tps_tuoqiao','tps_school_xj']],
			tps_re_chenkaihao: ['male', 'wei', 3, ['tps_jinze', 'tps_renqing'], ['des:陈凯豪可谓是初三四班最帅的之一，作为一个语文课代表，<s>他非常的尽职</s>。']],
			tps_xujingyi: ['male', 'wei', 3, ['xinjianxiong', 'tps_weigui'], ['des:徐憬怿作为秦王能面不改色地应对比他高一个头的荆轲（贵炀兄），违起纪来跟写一篇美妙的诗歌一样，而且他在这两个方面都做得很好。']],
			tps_hushiqun: ['male', 'wu', 3, ['tps_jinji','tps_guanlan','tps_tujin']],
			tps_re_lujunyu: ['male', 'qun', 3, ['tps_re_mensao']],
			tps_re_shouxintao:['male','shen',0,['tps_guoren','tps_school_xj'],['wu']],
			tps_re_xusichen: ['male', 'qun', 2, ['tps_zuobishen', 'tps_baofa', 'tps_school_hg']],
			tps_maozihao: ['male', 'shu', 3, ['tps_wanji', 'tps_gaile','tps_school_14']],
			tps_zhanglingkai: ['male', 'shu', 3, ['tps_huashui', 'xinguanxing','tps_shuipi']],
			tps_re_gechenqi: ['male', 'wu', 4, ['tps_nudui','reganglie']],
			tps_chenzhenbo: ['male', 'shu', 4, ['liangong', 'tps_juehou'], ['des:陈桢博，反低效学习小组创始人之一，是反低效学习小组中最有发言权的人，不仅如此，他还因为日人功夫了得而被太平吉安成员熟知。']],
			tps_yuanyuxuan: ['male', 'shu', 3, ['shensi', 'tiba',"tps_school_2z"], ['des:袁雨轩，是太平吉安总部最强大的刷题者，不仅作业刷的快，还有令人羡慕的好成绩。就是有时候老是被姚皇燊上。']],
			tps_re_chenhongliang: ['male', 'wu', 4, ['tps_lumang']],
			tps_re_panhaotian: ['male', 'shu', 3, ['tps_yonglan','tps_shicai','tps_cunmu','tps_school_xj'], ['des:潘皓天，太平吉安中不太突出的一个人物，喜欢阅读。']],
			tps_liangyue: ['male', 'shen', Infinity, ['tps_wudi', 'tps_shoucuo', 'tps_duoluo','tps_school_14'], ['des:太平吉安人际关系中心，爱好编程，但学习成绩并不稳定','shu']],
			tps_yaohuangshen: ['male', 'wu', 3, ['tps_huyou','tps_yuanhuo', 'jiuchi','tps_school_xj'], ['des:机灵鬼一个，身手矫健，爱耍小聪明。']],
			tps_re_zhangyihe: ['female', 'shen', 3, ['tps_nixue',"tps_school_2z"],['wei']],
			tps_re_fangyiyuan: ['female', 'qun', 3, ['tps_feili','tps_mengtai']],
			tps_chengjingya: ['female', 'qun', 4, ['tps_juai','tps_huoai','tps_school_xj']],
			tps_luxinting: ['female', 'wei', 3, ['tps_qinxue']],
			tps_liuchun: ['female', 'wu', 3, ['tps_jiwei']],
			tps_re_wangjing: ['female', 'qun', 3, ['xinzhiheng','tps_chadao','jiuyuan','tps_school_14'],['zhu']],
			//tps_re_zhangjiahui:['female','wu',3,['xiaoji','xinjieyin']],
			tps_mouminzi: ['female', 'wei', 3, ['tps_tianwen', 'tps_miaobi', 'tps_shenghua']],
			tps_re_chenyimiao: ['female', 'shen', 3, ['tps_re_qiangpo','tps_re_zhuanzhu', 'tps_school_hg'],['wei']],
			tps_re_laileshang: ['female', 'wei', 3, ['tps_bihu','tps_bili']],
			tps_re_wangchenxiao: ['female', 'shu', 3, ['tps_shushen', 'tps_zeyou', 'tps_school_hg']],
			tps_re_zhangche: ['female', 'wei', 3, ['tps_pianwen', 'tps_re_wencai', 'tps_school_hg']],
			tps_jiangxiyu:['female','qun',3,['tps_fanren','tps_school_xj']],
			tps_re_liufangfei: ['female', 'qun', 4, ['tps_gemo','hyunshen']],
			tps_re_yuruijia: ['female', 'shu', 3, ['tps_shushen','tps_school_14']],
			tps_laimeixi: ['female', 'qun', 3, ['lijian','beige']],
			
			tps_xpsj: ['male','shen',1,['tps_longduan','tps_huangpao','tps_school_2z','tps_school_xj','tps_school_14']],
			tps_re_wangjie: ['female', 'shu', 3,['tps_jiexin','tps_jiesi','tps_liuji']],

			tps_panhaotian: ['male', 'shu', 3, ['tps_wulai', 'tps_yinshang'], ['des:潘皓天，太平吉安中不太突出的一个人物，喜欢阅读。']],
			tps_chenhongliang: ['male', 'wu', 6, ['tps_zifu'], ['des:此货人际关系较广，不过许多都叫他欠债还钱。因为其举止有些粗鲁，一度被称为尸比（屁）。不过打架的话最好别找他。']],
			tps_shiao: ['male', 'shu', 4, ['tps_bufa', 'tps_bangtou'], ['des:施敖是最有天分也是最不守纪律的一个，初一初二从不写作业，经常带着他们寝室的人违纪。']],
			tps_huanghaojun: ['male', 'wei', 4, ['tps_siren','tps_zuosi','tps_shangjin'], ['des:黄浩峻对德意志第三帝国爱得深沉，因经常被葛大爷骂被誉为“死人”。']],
			tps_zhengqihang: ['male', 'shu', 3, ['tps_zilian', 'tps_qianshui'], ['des:在寿老师的眼里，郑启航就是个半吊子。不过同学们对他的了解不限于此。他推崇利益至上，甚至为此写了一本《利益论》（未完成）。他最著名的称号就是“王八”，因为他的签名就像“郑王八”。']],
			tps_chenkaihao: ['male', 'wei', 3, ['tps_jinze', 'tps_renqing'], ['des:陈凯豪可谓是初三四班最帅的之一，作为一个语文课代表，<s>他非常的尽职</s>。']],
			tps_xusichen: ['male', 'qun', 4, ['tps_bangtou', 'tps_gaizi'], ['des:你可不能小瞧短小精悍的徐思辰']],
			tps_zhangyihe: ['female', 'shen', 3, ['tps_yixue', 'tps_zhuangruo'],['wei']],
			tps_wanglina: ['female', 'qun', 4, ['tps_zuobi','tps_zuobie']],
			tps_xuqingyi: ['female', 'wei', 4, ['tps_zaoli']],
			tps_wangjing: ['female', 'qun', 3, ['tps_jianguan', 'xinzhiheng', 'jiuyuan'], ['zhu']],
			tps_laileshang: ['female', 'wei', 3, ['tps_bili']],
			tps_zhangche: ['female', 'wei', 3, ['tps_tianwen', 'tps_wencai']],
			tps_liujiqing: ['male', 'shu', 3, ['tps_jingxin']],
			tps_shouxintao: ['male', 'shen', 4, ['jiang', 'tps_youxiu', 'zhiba'], ['zhu','shu']],
			tps_gechenqi: ['male', 'wu', 4, ['tps_baohou', 'reganglie']],
			tps_chenzhanhao: ['male', 'wu', 4, ['tps_shigu', 'tps_zhuangzhuang']],
			tps_xiaohong: ['male', 'shen', 3, ['tps_zhuli','tps_zhitiao','tps_tongxiao'],['shu']],
			tps_liufangfei: ['female', 'qun', 4, ['tps_gemo']],
			tps_lujunyu: ['male', 'qun', 4, ['tps_mensao']],
			tps_hezihang: ['male', 'qun', 4, ['tps_caiyi','tps_fuyou']],
			tps_fangyiyuan: ['female', 'qun', 3, ['tps_feili']],
			tps_chenyimiao: ['female', 'shen', 3, ['tps_qiangpo','tps_zhuanzhu','tps_cangni'],['qun']],
			tps_wangxiaoya:['female','wu',10,['tps_cuimian','tps_tuifei']],
			tps_wangchengxiao:['female','wei',3,['wuyan','tps_sunyou']],
			tps_zhangjiahui:['female','wu',3,['xiaoji','xinjieyin']],
			tps_yuruijia:['female','shu',4,['xinwuyan']],
			tps_wangjie:['female','shu',3,['tps_fafen']],
			
			tps_geyanglin:['male','wei',1,['tps_nianmai','tps_tiankeng']],
			tps_xubiyuan:['male','shen',4,['tps_xiaozhang'],['wei']],
			tps_gaoyanzhong:['male','shen',3,['tps_zongheng','tps_dalue'],['wei']],
			tps_wanghongge: ['male', 'shu', 4, ['tps_jinye','tps_nanti']],
			tps_renyanguo: ['male', 'shu', 3, ['tps_fanxing', 'tps_gaile', 'tps_jianguan', 'tps_songwei'], ['zhu']],
			tps_zhangjingchao: ['female', 'wei', 3, ['tps_jianguan', 'tps_guanban', 'tps_yali', 'tps_weiwang'], ['zhu']],
			tps_dingjianxin: ['female', 'qun', 3, ['tps_kuanrong']],
			tps_zhouxiaoyan: ['female', 'qun', 3, ['tps_chaqin']],
			tps_huzhichao: ['male', 'shu', 4, ['tps_chachu', 'tps_baonve'], ['zhu']],
			tps_zhujianglu: ['female', 'shu', 3, ['tps_laoshou', 'tps_laolian']],
			tps_wangmeidie: ['female', 'wei', 4, ['tps_fengkuang', 'tps_shikong']],
			//tps_sunbohua: ['male', 'shu', 4, ['tps_luanma','debug_lmk1','debug_lmk2','debug_lmk3','debug_lmk4','debug_lmk5']],
			tps_shenguojun: ['male','wu',4,['tps_qiling']],
			tps_jiangmin: ['female', 'wu', 3, ['tps_shulian']],
			tps_qianjunlei:['male','wu',5,['tps_yuben','tps_guaili']],
		};
		result.characterSort={
			tps:{
				tps_teachers:['tps_geyanglin','tps_xubiyuan','tps_gaoyanzhong','tps_wanghongge','tps_renyanguo','tps_zhangjingchao','tps_dingjianxin','tps_zhouxiaoyan','tps_huzhichao','tps_zhujianglu','tps_wangmeidie','tps_shenguojun','tps_jiangmin','tps_qianjunlei'],
			    tps_students:['tps_re_liujiqing','tps_re_xiaohong','tps_zhoulinghang','tps_re_hezihang','tps_wangzile','tps_wangguiyang','tps_wumengxiang','tps_re_shiao','tps_xuheng','tps_re_huanghaojun','tps_re_zhengqihang','tps_re_chenkaihao','tps_xujingyi','tps_hushiqun','tps_re_lujunyu','tps_re_shouxintao','tps_re_xusichen','tps_maozihao','tps_zhanglingkai','tps_re_gechenqi','tps_chenzhanhao','tps_chenzhenbo','tps_yuanyuxuan','tps_re_chenhongliang','tps_re_panhaotian','tps_liangyue','tps_yaohuangshen','tps_re_zhangyihe','tps_re_fangyiyuan','tps_chengjingya','tps_luxinting','tps_liuchun','tps_wangxiaoya','tps_re_wangjing','tps_zhangjiahui','tps_mouminzi','tps_re_chenyimiao','tps_re_laileshang','tps_re_wangchenxiao','tps_re_zhangche','tps_jiangxiyu','tps_re_liufangfei','tps_re_yuruijia','tps_laimeixi','tps_xpsj','tps_re_wangjie','tps_xuqingyi','tps_wanglina'],
				tps_old:['tps_liujiqing','tps_xiaohong','tps_hezihang','tps_shiao','tps_huanghaojun','tps_zhengqihang','tps_chenkaihao','tps_lujunyu','tps_shouxintao','tps_xusichen','tps_gechenqi','tps_chenhongliang','tps_panhaotian','tps_zhangyihe','tps_fangyiyuan','tps_wangjing','tps_chenyimiao','tps_laileshang','tps_wangchengxiao','tps_zhangche','tps_liufangfei','tps_yuruijia','tps_wangjie',]
			},
		};
		result.characterFilter={};
		result.characterIntro={
			tps_re_liujiqing:"<strong>作为杭州市的中考状元之一</strong>，“柳季青一直是一个规范的孩子”，这是大部分老师对他一致的评价。规范的排版，规范的学习方法，规范的……",
			tps_re_xiaohong:"装逼的小红像太阳，照耀着四班的大地，摧毁者同学的希望，小红的留级是不可战胜的力量。",
			tps_zhoulinghang:"阳光四班最活跃也最爱打篮球的数学课代表，这三年来不仅他的数学成绩频频令大家叹为观止，他的感情生活也收获颇丰。",
			tps_re_hezihang:"他是阳光四班初一初二时的“泥哥”，也是初三上时最为耀眼的黑马，东南的磨练使他从才艺到学习方面的潜力统统爆发。",
			tps_wangzile:"113和一些女生眼中当之无愧的携带食品担当，通过自己老油条一样的违纪技术，他很少被发现。",
			tps_wangguiyang:"作为全东南闻名遐迩的戏精和全年级闻名的杠精，王贵炀有着一个不一样的脑子和浪费灵魂和无心。",
			tps_wumengxiang:"吴孟祥，虽然很胖但打篮球很灵活，<strong>现已离开东南</strong>。",
			tps_re_shiao:'施敖是最有天分也是最不守纪律的一个，初一初二从不写作业，经常带着他们寝室的人违纪。',
			tps_xuheng:"他虽目光呆滞，但其分数惊人；他虽其貌不扬，却是一个投实心球的好手。",
			tps_re_huanghaojun:"黄浩峻对德意志第三帝国爱得深沉，因经常被葛大爷骂被誉为“死人”而得称号。",
			tps_re_zhengqihang:"郑同学因为自己写自己的名字写的像个“郑**”而获得了“**”的称号，委婉来说就是“鳖”或“王九”。总想用自己的一套“利益论”解释问题。",
			tps_re_shouxintao:'寿鑫涛，阳光四班大名鼎鼎的名誉班长，看似中上徘徊的成绩，却直夺<strong>学军保送生考试第二名（据某副校长言，不过寿自己也不知道）</strong>；看似放浪的学习态度，却拿下校四模年级第一。',
			tps_re_xusichen:'你可不能小瞧短小精悍的徐思辰，这人既能作弊被抓，又能名列前茅。',
			tps_re_chenhongliang:'此货人际关系较广，不过许多都叫他欠债还钱。因为其举止有些粗鲁，一度被称为尸比（屁）。不过打架的话最好别找他。',
			tps_re_zhangyihe:'作为阳光四班当之无愧的学神，她的年级第一次数雄霸年级第一，作为<strong>二中的保送生</strong>，她有一个美好的未来。',
			tps_re_zhangche:"她可以说是一个能与牟旻紫有一拼的写作好手，优美的文章备受老师们的青睐，她在其他方面的努力也正在被大家所认可。",
			tps_jiangxiyuL:"(暂无)",
			tps_re_yuruijia:"她是女生中最为规范的人之一，无论是老王还是老朱都认可她的答题规范，她安静地学习，安静地做人。",
			tps_laimeixi:'阳光四班全职抄写课表人，并作为一名持续进步的好榜样留在阳光四班的人心中。',
        };
		result.characterTitle={};
		result.perfectPair={};
	}
	if(lib.config.extension_太平联机_enable&&lib.config.extension_太平联机_connect){
	    result.connect=true;
	}
	return result;
});

